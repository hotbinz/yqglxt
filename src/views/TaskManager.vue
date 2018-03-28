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
        </Header>
        <Content>
            <Table :height="tableHeight" :columns="getCloumn" :data="data"></Table>
        </Content>
        <Footer class="layout-footer"><Page :total="40" size="small" show-total></Page></Footer>
    </Layout>
</template>
<script>
    export default {
        data () {
            return {
                tableHeight : document.documentElement.clientHeight - 195,
                data: [
                    {
                        name: 'John Brown',
                        age: 18,
                        address: 'New York No. 1 Lake Park',
                        date: '2016-10-03'
                    }
                ]
            }
        },
        mounted() {
            const that = this
            window.onresize = () => {
                that.tableHeight = document.documentElement.clientHeight - 195
            };         
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
                        width: '60'
                    },{
                        title: '任务类型',
                        key: 'type',
                        width: '85'
                    },{
                        title: '任务名称',
                        key: 'name',
                        width: '130'
                    },{
                        title: cname,
                        key: 'content'
                    },{
                        title: '执行帐号',
                        key: 'account',
                        width: '90'
                    },{
                        title: '任务状态',
                        key: 'status',
                        width: '90'
                    },{
                        title: '执行时间',
                        key: 'time',
                        width: '90'
                    }];
                if(type == "youtube") {
                    cloumnjson.push({
                        title: '点赞方式',
                        key: 'rate',
                        width: '90'
                    });
                }            
                cloumnjson.push({
                        title: '操作',
                        key: 'show_more',
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
            NewEvent(item) {
                var type = this.$route.params.type;
                window.open("#/New/"+type+"Task?type=" + item,"modal" ,"width=500,height=500,resizable=false");
            }
        }
    }
</script>