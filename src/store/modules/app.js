const app = {
    state: {
        currentPageName: ''
    },
    mutations:{
        setCurrentPageName(state, pageName) {
            state.currentPageName = pageName;
        }
    }
}
export default app;