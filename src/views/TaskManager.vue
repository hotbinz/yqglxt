<style scoped>
.layout {
    padding: 0px 10px;
}
.layout-header{
    background: none;
    padding: 15px 0px;
    height: auto;
    line-height: normal;
}
.layout-footer {
    padding: 20px 0px;
    text-align: center;
}
.new-btn{
    margin-right:20px;
}
</style>
<template>
    <Layout class="layout">
        <Header class="layout-header">   
            <Row>
                <Col span="8">
                    <Dropdown>
                        <Button type="primary">
                            新建任务
                            <Icon type="arrow-down-b"></Icon>
                        </Button>
                        <DropdownMenu slot="list">
                            <DropdownItem v-for="item in getNewBtnAry" :key="item.value" @click.native="NewEvent(item.value)">
                                <Icon :type="item.icon" size="14"></Icon>
                                {{item.key}}任务
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>    
                </Col>
                <Col span="8" offset="8">
                    <Input v-model="searchVal" @on-enter="searchTheme" placeholder="请输入搜索内容...">
                        <Button slot="append" icon="ios-search" @click="searchTheme">搜索</Button>
                    </Input>
                </Col>
            </Row>   
        </Header>
        <Content>
            <Table :height="tableHeight" :loading="loading" :columns="getCloumn" :data="data"></Table>
        </Content>
        <Footer class="layout-footer"><Page :total="page.total" size="small" show-total :current.sync="page.current" @on-change="pageChange"></Page></Footer>
    </Layout>
</template>
<script>
    export default {
        data () {
            return {
                tableHeight : document.documentElement.clientHeight - 195,
                loading: true,
                searchVal:'',
                data: [],
                page: {
                    total: 0,
                    pageSize: 10,
                    current: 1,
                    minId: 0,
                }
            }
        },
        mounted() {
            const that = this
            window.onresize = () => {
                that.tableHeight = document.documentElement.clientHeight - 195
            };         
            this.getList();
        },
        computed:{
            getNewBtnAry() {
                var type = this.$route.params.type;
                if(type == "twitter") {
                    return [
                        {key:"发推",value:"create",icon:"compose"}, 
                        {key:"回推",value:"reply",icon:"forward"}, 
                        {key:"转推",value:"forward",icon:"share"}
                    ]
                }
                else if(type == "youtube") {
                    return [
                        {key:"点赞",value:"vote",icon:"thumbsup"}, 
                        {key:"留言",value:"reply",icon:"chatbox"}
                    ]
                }
            },
            getCloumn() {
                var type = this.$route.params.type;
                var cname = (type == "twitter") ? "推文内容" : "留言内容";
                var cloumnjson = [{
                        title: '任务ID',
                        key: 'id',
                        align: 'center',
                        width: '60'
                    },{
                        title: '任务类型',
                        key: 'type',
                        align: 'center',
                        width: '85'
                    },{
                        title: '任务名称',
                        key: 'name',
                        align: 'center',
                        width: '130'
                    },{
                        title: cname,
                        key: 'content',
                        align: 'center',
                    },{
                        title: '执行帐号',
                        key: 'account',
                        align: 'center',
                        width: '90'
                    },{
                        title: '任务状态',
                        key: 'status',
                        align: 'center',
                        width: '90'
                    },{
                        title: '执行时间',
                        key: 'time',
                        align: 'center',
                        width: '90'
                    }];
                if(type == "youtube") {
                    cloumnjson.push({
                        title: '点赞方式',
                        key: 'rate',
                        align: 'center',
                        width: '90'
                    });
                }            
                cloumnjson.push({
                        title: '操作',
                        key: 'show_more',
                        align: 'center',
                        width: '90px',
                        render: (h, params) => {
                            return h('Button', {
                                props: {
                                    type: 'text',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        let argu = { order_id: params.row.order_id };
                                        this.$router.push({
                                            name: 'order-info',
                                            params: argu
                                        });
                                    }
                                }
                            }, '详情');
                        }
                    });    
                return cloumnjson;
            }
        },
        methods :{
            getList(type) {
                var themType = this.$route.params.type
                this.loading = true
                let param = 'size=' + this.page.pageSize + '&start=' + this.page.current
                if (this.searchVal != '') {
                    param += '&name=' + this.searchVal
                }
                this.axios.get("/task/list_"+themType+".html?" + param).then((response)=>{
                    this.loading = false
                    // 翻页操作，不更新total
                    if (type != 'paging') {
                        this.page.total = response.data.total;
                    }
                    this.data = response.data.datas;
                });
            },
            NewEvent(item) {
                var type = this.$route.params.type;
                window.open("#/New/"+type+"Task?type=" + item,"modal" ,"width=500,height=500,resizable=false");
            },
            pageChange(page) {
                this.getList('paging')
            },
            searchTheme() {
               this.getList('searching')
            }
        },
        watch: {
            '$route' (to) {
                this.getList()
            }
        }
    }
</script>