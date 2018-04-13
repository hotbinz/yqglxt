const user = {
    state: {
        id:'',
        username: '',
        password: ''
    },
    mutations:{
        setUserInfo(state, data) {
            state.id = data.id;
            state.username = data.username;
            state.password = data.password;
        },
        resetUserInfo(state) {
            state.id = '';
            state.username = '';
            state.password = '';
        }
    }
}
export default user;