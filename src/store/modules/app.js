const app = {
    state: {
        currentPageName: '',
        user:{
            twitter:{
                consumer_key:'',
                consumer_secret:'',
                access_token:'',
                access_token_secret:''
            }
        },
        token:null
    },
    mutations:{
        setCurrentPageName(state, pageName) {
            state.currentPageName = pageName;
        },
        setUserSetting(state, data) {
            state.user.twitter.consumer_key = data.consumer_key;
            state.user.twitter.consumer_secret = data.consumer_secret;
            state.user.twitter.access_token = data.access_token;
            state.user.twitter.access_token_secret = data.access_token_secret;
        },
        setToken(state, data) {
            localStorage.token = data;
            state.token = data;
        },
        removeToken (state) {
            localStorage.removeItem('token');
            state.token = null
        },
    }
}
export default app;