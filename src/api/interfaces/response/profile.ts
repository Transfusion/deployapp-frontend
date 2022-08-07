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
  username: string;
  name: string;
  email?: string;
}

export default Profile