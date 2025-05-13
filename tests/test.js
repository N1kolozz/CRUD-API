import http from 'http';
import assert from 'assert';

const BASE_URL = 'http://localhost:3000/api/users';
let createdUserId = '';


function makeRequest(url, method, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(url, options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        const statusCode = res.statusCode;
        let parsedData;
        
        try {
          
          if (responseData && statusCode !== 204) {
            parsedData = JSON.parse(responseData);
          }
        } catch (e) {
          parsedData = responseData;
        }

        resolve({ statusCode, data: parsedData });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}


async function runTests() {
  try {
    console.log('Starting API tests...');


    console.log('\nTest 1: Get all users (initially empty)');
    const getAllResponse = await makeRequest(BASE_URL, 'GET');
    assert.strictEqual(getAllResponse.statusCode, 200);
    assert(Array.isArray(getAllResponse.data));
    console.log('✅ Test 1 passed: GET all users returned status 200 and an array');


    console.log('\nTest 2: Create a new user');
    const newUser = {
      username: 'John Doe',
      age: 30,
      hobbies: ['Reading', 'Coding']
    };
    
    const createResponse = await makeRequest(BASE_URL, 'POST', newUser);
    assert.strictEqual(createResponse.statusCode, 201);
    assert.strictEqual(createResponse.data.username, newUser.username);
    assert.strictEqual(createResponse.data.age, newUser.age);
    assert.deepStrictEqual(createResponse.data.hobbies, newUser.hobbies);
    assert(createResponse.data.id);
    

    createdUserId = createResponse.data.id;
    console.log('✅ Test 2 passed: POST created a new user with status 201');


    console.log('\nTest 3: Get user by ID');
    const getUserResponse = await makeRequest(`${BASE_URL}/${createdUserId}`, 'GET');
    assert.strictEqual(getUserResponse.statusCode, 200);
    assert.strictEqual(getUserResponse.data.id, createdUserId);
    console.log('✅ Test 3 passed: GET user by ID returned status 200 and correct user');


    console.log('\nTest 4: Update user');
    const updatedUser = {
      username: 'John Updated',
      age: 31,
      hobbies: ['Reading', 'Coding', 'Gaming']
    };
    
    const updateResponse = await makeRequest(`${BASE_URL}/${createdUserId}`, 'PUT', updatedUser);
    assert.strictEqual(updateResponse.statusCode, 200);
    assert.strictEqual(updateResponse.data.username, updatedUser.username);
    assert.strictEqual(updateResponse.data.age, updatedUser.age);
    assert.deepStrictEqual(updateResponse.data.hobbies, updatedUser.hobbies);
    console.log('✅ Test 4 passed: PUT updated the user with status 200');


    console.log('\nTest 5: Delete user');
    const deleteResponse = await makeRequest(`${BASE_URL}/${createdUserId}`, 'DELETE');
    assert.strictEqual(deleteResponse.statusCode, 204);
    console.log('✅ Test 5 passed: DELETE removed the user with status 204');


    console.log('\nTest 6: Try to get deleted user');
    const getDeletedUserResponse = await makeRequest(`${BASE_URL}/${createdUserId}`, 'GET');
    assert.strictEqual(getDeletedUserResponse.statusCode, 404);
    console.log('✅ Test 6 passed: GET deleted user returned status 404');


    console.log('\nTest 7: Try to get user with invalid UUID');
    const invalidUuidResponse = await makeRequest(`${BASE_URL}/invalid-uuid`, 'GET');
    assert.strictEqual(invalidUuidResponse.statusCode, 400);
    console.log('✅ Test 7 passed: GET with invalid UUID returned status 400');

    console.log('\nAll tests passed! 🎉');
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}


console.log('Make sure your server is running on port 3000 before running tests.');
console.log('Starting tests in 2 seconds...');

setTimeout(runTests, 2000);