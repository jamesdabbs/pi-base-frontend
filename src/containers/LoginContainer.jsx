import { connect } from 'react-redux'
import LoginBar from '../components/LoginBar'

import { login, logout } from '../actions'

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onClick: () => { dispatch(login("Testing")) }
    }
}

const LoginContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginBar)

export default LoginContainer
