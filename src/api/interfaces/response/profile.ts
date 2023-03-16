/**
 * {
    "authenticated": false,
    "id": null,
    "has_username": false,
    "username": "anonymous",
    "name": "Anonymous",
    "email": null
}
 */
interface Profile {
  authenticated: boolean;
  id?: string;
  has_username: boolean;
  has_password: boolean;
  username: string;
  name: string;
  email?: string;

  oauth_login: boolean;
  oauth_registration_id?: string;

  has_anonymous_data: boolean;
}

export default Profile