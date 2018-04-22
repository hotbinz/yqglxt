const app = {
    state: {
        currentPageName: '',
        user:{
            twitter:{
                consumer_key:'',
                consumer_secret:'',
                access_token:'',
                access_token_secret:''
            },
            youtube:{
                client_secret:'',
                code:''
            }
        },
        token:null
    },
    mutations:{
        setCurrentPageName(state, pageName) {
            state.currentPageName = pageName;
        },
        setTwitterUserSetting(state, data) {
            state.user.twitter.consumer_key = data.consumer_key;
            state.user.twitter.consumer_secret = data.consumer_secret;
            state.user.twitter.access_token = data.access_token;
            state.user.twitter.access_token_secret = data.access_token_secret;
        },
        setYoutubeUserSetting(state, data) {
            state.user.youtube.client_secret = client_secret;
            state.user.youtube.code = data.code;
        },
        setToken(state, data) {
            localStorage.token = data;
            state.token = data;
        },
        removeToken (state) {
            localStorage.removeItem('token');
            state.token = null
        },
        resetUserSetting(state) {
            state.user.twitter.consumer_key = '';
            state.user.twitter.consumer_secret = '';
            state.user.twitter.access_token = '';
            state.user.twitter.access_token_secret = '';
        }
    }
}
export default app