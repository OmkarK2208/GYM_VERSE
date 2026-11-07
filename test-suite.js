const http = require('http');

const BASE_URL = 'http://localhost:3000';
let sessionCookie = '';
const testUser = {
  email: `test_athlete_${Date.now()}@gymverse.com`,
  password: 'Password123!',
  name: 'Cyber Athlete',
  age: '26',
  gender: 'Male',
  height: '180',
  weight: '78.5',
  goal: 'Bulk'
};

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const headers = options.headers || {};
    if (sessionCookie) {
      headers['Cookie'] = sessionCookie;
    }
    if (options.body) {
      headers['Content-Type'] = 'application/json';
    }

    const req = http.request(url, {
      method: options.method || 'GET',
      headers
    }, (res) => {
      let data = '';
      if (res.headers['set-cookie']) {
        const cookies = Array.isArray(res.headers['set-cookie']) 
          ? res.headers['set-cookie'] 
          : [res.headers['set-cookie']];
        for (const c of cookies) {
          if (c.startsWith('session=')) {
            sessionCookie = c.split(';')[0];
          }
        }
      }
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(data); } catch (_) {}
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: json || data
        });
      });
    });

    req.on('error', reject);
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

const results = [];
function record(feature, testName, passed, details = '') {
  results.push({ feature, testName, passed, details });
  const icon = passed ? '✅' : '❌';
  console.log(`${icon} [${feature}] ${testName} ${details ? '(' + details + ')' : ''}`);
}

async function runAllTests() {
  console.log('🚀 INITIATING COMPLETE GYM VERSE END-TO-END SYSTEM TEST\n');

  // --- 1. TEST REGISTRATION ---
  try {
    const regRes = await request('/api/auth/register', {
      method: 'POST',
      body: testUser
    });
    record('Auth: Register', 'Create new user with body stats', regRes.status === 201, `Status: ${regRes.status}`);
  } catch (err) {
    record('Auth: Register', 'Create new user', false, err.message);
  }

  // --- 2. TEST CURRENT SESSION AUTH ME ---
  try {
    const meRes = await request('/api/auth/me');
    const valid = meRes.status === 200 && meRes.data?.email === testUser.email;
    record('Auth: Session', 'Read authenticated profile from JWT', valid, `User: ${meRes.data?.name}`);
  } catch (err) {
    record('Auth: Session', 'Read authenticated profile', false, err.message);
  }

  // --- 3. TEST OTP FLOW ---
  try {
    const otpReq = await request('/api/auth/otp', {
      method: 'POST',
      body: { email: testUser.email }
    });
    const otp = otpReq.data?.otp;
    record('Auth: OTP Request', 'Generate OTP and store in DB', otpReq.status === 200 && !!otp, `Code: ${otp}`);

    // Verify login with OTP
    const otpLogin = await request('/api/auth/login', {
      method: 'POST',
      body: { email: testUser.email, otp }
    });
    record('Auth: OTP Login', 'Authenticate session using generated OTP', otpLogin.status === 200, `Status: ${otpLogin.status}`);
  } catch (err) {
    record('Auth: OTP Flow', 'OTP Request & Login', false, err.message);
  }

  // --- 4. TEST PASSWORD LOGIN ---
  try {
    const pwdLogin = await request('/api/auth/login', {
      method: 'POST',
      body: { email: testUser.email, password: testUser.password }
    });
    record('Auth: Password Login', 'Authenticate session using bcrypt password', pwdLogin.status === 200, `Status: ${pwdLogin.status}`);
  } catch (err) {
    record('Auth: Password Login', 'Password Login', false, err.message);
  }

  // --- 5. TEST DASHBOARD API ---
  try {
    const dashRes = await request('/api/dashboard');
    const hasFields = dashRes.data && 
      'user' in dashRes.data && 
      'todayVolume' in dashRes.data && 
      'bmi' in dashRes.data && 
      'waterAmount' in dashRes.data;
    record('Dashboard', 'Fetch aggregated telemetry stats', dashRes.status === 200 && hasFields, `BMI: ${dashRes.data?.bmi}`);
  } catch (err) {
    record('Dashboard', 'Fetch aggregated telemetry stats', false, err.message);
  }

  // --- 6. TEST WATER INTAKE LOGGING ---
  try {
    const waterPost = await request('/api/water', { method: 'POST' });
    record('Hydration', 'Log 0.5L water increment to database', waterPost.status === 200, `Status: ${waterPost.status}`);

    const dashAfterWater = await request('/api/dashboard');
    const waterAmount = dashAfterWater.data?.waterAmount;
    record('Hydration', 'Verify water increment reflected in dashboard', waterAmount >= 0.5, `Amount: ${waterAmount}L`);
  } catch (err) {
    record('Hydration', 'Water logging flow', false, err.message);
  }

  // --- 7. TEST WORKOUT LOGGING & PR DETECTION ---
  try {
    const workoutData = {
      category: 'Chest',
      duration: '45',
      exercises: [
        { name: 'Incline Bench Press', weight: 100, sets: 1, reps: 8 },
        { name: 'Cable Flyes', weight: 25, sets: 1, reps: 12 }
      ]
    };
    const workPost = await request('/api/workouts', {
      method: 'POST',
      body: workoutData
    });
    record('Workout', 'Save multi-exercise workout session', workPost.status === 201, `Status: ${workPost.status}`);

    const workGet = await request('/api/workouts');
    const hasWorkouts = Array.isArray(workGet.data) && workGet.data.length > 0;
    record('Workout', 'Retrieve workout history from database', hasWorkouts, `Count: ${workGet.data?.length}`);
  } catch (err) {
    record('Workout', 'Workout logging flow', false, err.message);
  }

  // --- 8. TEST DIET / 3D BOWL PERSISTENCE ---
  try {
    const mealData = {
      meal: '3D Power Bowl (Moong, Matki, Soya Chunks)',
      calories: 450,
      protein: 38
    };
    const dietPost = await request('/api/diet', {
      method: 'POST',
      body: mealData
    });
    record('Diet Studio', 'Persist 3D bowl meal to database', dietPost.status === 201, `Status: ${dietPost.status}`);

    const dietGet = await request('/api/diet');
    const hasDiet = Array.isArray(dietGet.data) && dietGet.data.some(m => m.calories === 450);
    record('Diet Studio', 'Retrieve today meals from database', hasDiet, `Meals logged: ${dietGet.data?.length}`);
  } catch (err) {
    record('Diet Studio', 'Diet logging flow', false, err.message);
  }

  // --- 9. TEST WEIGHT TRACKING ---
  try {
    const weightPost = await request('/api/weight', {
      method: 'POST',
      body: { weight: 79.2 }
    });
    record('Weight Tracker', 'Log new weigh-in to database', weightPost.status === 201, `Status: ${weightPost.status}`);

    const weightGet = await request('/api/weight');
    const hasWeight = Array.isArray(weightGet.data) && weightGet.data.length > 0;
    record('Weight Tracker', 'Retrieve chronological weight trajectory', hasWeight, `Entries: ${weightGet.data?.length}`);
  } catch (err) {
    record('Weight Tracker', 'Weight tracking flow', false, err.message);
  }

  // --- 10. TEST ALL FRONTEND ROUTES (HTTP 200 OK) ---
  const routes = [
    { name: 'Landing Universe', path: '/' },
    { name: 'Login Portal', path: '/login' },
    { name: 'Registration Page', path: '/register' },
    { name: 'Password Recovery', path: '/forgot-password' },
    { name: 'Dashboard Overview', path: '/dashboard' },
    { name: 'Workout Studio', path: '/dashboard/workout' },
    { name: 'Diet & 3D Bowl Studio', path: '/dashboard/diet' },
    { name: 'Weight Tracker', path: '/dashboard/weight' },
    { name: 'Performance Analytics', path: '/dashboard/analytics' }
  ];

  console.log('\n🌐 TESTING ALL FRONTEND PAGES...');
  for (const r of routes) {
    try {
      const pageRes = await request(r.path);
      const ok = pageRes.status === 200 && typeof pageRes.data === 'string' && pageRes.data.length > 1000;
      record('Frontend Page', `${r.name} (${r.path})`, ok, `HTTP ${pageRes.status}, ${pageRes.data?.length} bytes`);
    } catch (err) {
      record('Frontend Page', `${r.name} (${r.path})`, false, err.message);
    }
  }

  // Summary
  console.log('\n========================================');
  const passedCount = results.filter(r => r.passed).length;
  console.log(`🎯 TOTAL TESTS: ${results.length} | PASSED: ${passedCount} | FAILED: ${results.length - passedCount}`);
  console.log('========================================\n');
  process.exit(results.length - passedCount === 0 ? 0 : 1);
}

runAllTests();
