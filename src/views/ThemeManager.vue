<style scoped>
.layout {
    padding: 0px 10px;
}
.layout-header{
    background: none;
    padding: 20px 0px;
    height:auto;
    line-height: 35px;
}
.layout-footer {
    padding: 20px 0px;
    text-align: center;
}
.flexcenter{
    width:500px;
    margin:auto;
}
.layout .ivu-table-cell {
    padding-right:5px;
    padding-left:5px;
}
</style>
<template>
    <Layout class="layout">
        <Header class="layout-header">
            <Row>
                <Col span="8">
                    <Button type="primary" @click="NewTwitterTheme" icon="social-twitter">新建Twitter主题</Button>
                </Col>
                <Col span="8" offset="8">
                    <Input v-model="searchval">
                        <Button slot="append" icon="ios-search">搜索</Button>
                    </Input>
                </Col>
            </Row>            
        </Header>
        <Content>
            <Table :height="tableHeight" :loading="loading" :columns="columns" :data="data"></Table>
        </Content>
        <Footer class="layout-footer"><Page :total="total" size="small" show-total></Page></Footer>
    </Layout>
</template>
<script>
    export default {
        data () {
            return {
                tableHeight : document.documentElement.clientHeight - 175,
                searchval:'',
                loading: true,
                total:0,
                columns: [
                    {
                        title: 'ID',
                        key: 'id',
                        width :'50'
                    },
                    {
                        title: '发布者',
                        key: 'author_name',
                        width :'120',
                        render (h, column) {
                            return [
                                h('Icon',{
                                    props: {
                                        type:"person"
                                    }                                    
                                }),
                                h('strong',`${column.row.author_name}`)
                            ]
                        }
                    },
                    {
                        title: '推文内容',
                        key: 'text',
                        render:(h,column) => {
                            return h('a',{
                                domProps:{
                                    href:column.row.url,
                                    target:"_blank"
                                }                                
                            },
                            column.row.text);
                        }
                    },
                    {
                        title: '创建时间',
                        key: 'create_at',
                        width :'110'
                    },
                    {
                        title: '点赞数',
                        key: 'favorite_count',
                        width :'80'                    
                    },
                    {
                        title: '转推数',
                        key: 'retweet_count',
                        width :'80',
                    },
                    {
                        title: '操作',
                        key: 'show_more',
                        align: 'center',
                        width :'160px',
                        render (h) {
                            return [
                                    h('Button', {
                                        props: {
                                            type: 'success',
                                            shape: 'circle',
                                            size:"small"
                                        }
                                    }, '同步'),
                                    h('Button', {
                                        style: {
                                            marginLeft: "10px",
                                        },
                                        props: {
                                            type: 'error',
                                            shape: 'circle',
                                            size:"small"
                                        }
                                    }, '删除')
                            ];
                        }
                    }

                ],
                data: []
            }
        },
        mounted() {
            const that = this;
            window.onresize = () => {
                that.tableHeight = document.documentElement.clientHeight - 175
            }    
            this.getList();
            
        },
        methods:{
            getList() {
                //先登录再取
                this.axios.post("/login.html",{username:'admin@ovio.com',password: 'Ovio123<>?'}).then((response)=>{
                    if(response.data.result == 1) {
                        this.axios.get("/theme/twitter/list.html?size=20&type=json").then((gdata)=>{
                            this.loading = false;
                            this.total = gdata.data.total;
                            this.data = gdata.data.datas;
                        });
                    }                
                }).catch(function (response) {
                    console.log(response);
                });
            },
            NewTwitterTheme() {
                let win = window.open("#/New/TwitterTheme","modal" ,"width=400,height=400,resizable=false");
                var that = this;
                win.onbeforeunload = () => {
                    that.getlist();    
                };
            },
            show() {

            },
            remove() {

            }
        }
    }
</script>