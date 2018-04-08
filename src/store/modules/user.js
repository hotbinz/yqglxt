const user = {
    state: {
        username: '',
        password: ''
    },
    mutations:{
        setUserInfo(state, data) {
            state.username = data.username;
            state.password = data.password;
        }
    }
}
export default user;