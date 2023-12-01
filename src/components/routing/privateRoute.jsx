import {Navigate} from "react-router-dom";
import PropTypes from "prop-types";

function PrivateRoute({ children }) {
    const cookies = document.cookie
    const cookiesArray = cookies.split(';')
    let JWTtoken = null
    const JWTcookie = cookiesArray.find(cookie => cookie.trim().startsWith('legpromauth'))
    if (JWTcookie) {
        JWTtoken = JWTcookie.split('=')[1].trim();
    }

    if (JWTtoken === null) {
        return <Navigate to="/" />;
    }

    console.log(JWTtoken)

    return children
}

PrivateRoute.propTypes = {
    children: PropTypes.node
}
export default PrivateRoute 