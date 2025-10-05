import axios from 'axios';


export const signUp = async (user) => {
    // eslint-disable-next-line no-useless-catch
    try {
        return await axios.post(
            `http://localhost:8080/api/v1/user`,
            user
        );
    } catch (err) {
        throw err;
    }
};