var API_ENDPOINT = hot_api/api

POST register // Sign in
  API_ENDPOINT/register
POST authenticate // Log in
  API_ENDPOINT/authenticate
GET users
  API_ENDPOINT/users
UPDATE users
  API_ENDPOINT/users/:user_id

GET Chat // Get all message
  API_ENDPOINT/chat
POST Chat // Create message
  API_ENDPOINT/chat
PUT chat // Modify message
  API_ENDPOINT/chat/:message_id
DELETE chat // Delete message
  API_ENDPOINT/chat/:message_id
