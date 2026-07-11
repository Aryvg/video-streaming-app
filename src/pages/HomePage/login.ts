import axios from 'axios';
import { setAccessToken } from '../mainPage/auth';

export const handleLogin = (
    loginEmail: string,
    loginPassword: string,
    submitting: boolean,
    setLoginMessage: (msg: string) => void,
    setSubmitting: (value: boolean) => void,
    navigate: (path: string) => void
) => async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (submitting) return;

    setLoginMessage('');
    setSubmitting(true);

    try {
        const response = await axios.post('https://videostreamingbackend-dxgv.onrender.com/auth', {
            username: loginEmail.trim(),
            password: loginPassword.trim(),
        }, {
            withCredentials: true,// what this does is it sends a POST request to 'https://videostreamingbackend-dxgv.onrender.com/auth' with the provided username and password. If the response status is 200, it sets the access token in memory and navigates to the main page. If there's an error, it sets an error message indicating that the login failed.
        });

        if (response.status === 200) {
            setAccessToken(response.data?.accessToken || null);//does this send the access token to the server? No, it stores the access token in memory on the client side for use in authenticated requests.
            navigate('/mainPage');
        }
    } catch (error) {
        setLoginMessage('Wrong username or password. Please try again.');
        console.error('Login failed:', error);
    } finally {
        setSubmitting(false);
    }
};
//in loginForm.tsx, we have 
/*
<button
          type="submit"
          className="submit-button"
          disabled={loginLoading || submitting}
          onClick={handleLogin(
            loginEmail,
            loginPassword,
            submitting,
            setLoginMessage,
            setSubmitting,
            navigate
          )}
        >
          {loginLoading || submitting ? <Spinner /> : 'Log In'}
        </button>
 */