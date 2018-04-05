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
        <Modal v-model="modal_delete" width="260">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>删除确认</span>
            </p>
            <div style="text-align:center">
                <p>真的要删除这个Twitter主题吗？</p>
                <p>Will you delete it?</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long :loading="modal_loading" @click="ActionDel">删除</Button>
            </div>
        </Modal>
    </Layout>
</template>
<script>
    export default {
        data () {
            return {
                tableHeight : document.documentElement.clientHeight - 175,
                searchval:'',
                loading: true,
                modal_delete: false,
                modal_loading: false,
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
                        render: (h, params) => {
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
                                        },
                                        on: {
                                            click: () => {
                                                this.removeTheme(params.index,params.row.url)                                                
                                            },
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
            //删除主题
            removeTheme(index, url) {
                this.modal_delete = true; 
                this.$Modal.index = index;
                this.$Modal.url = url; 
            },
            ActionDel() {
                this.modal_loading = true;
                this.axios.post("/theme/twitter/delete.html",{"url":this.$Modal.url}).then((response)=>{
                    if(response.data.result == 1)
                    {
                        this.modal_delete = false;    
                        this.modal_loading = false;
                        this.data.splice(this.$Modal.index, 1);
                    }                    
                })
            }
        }
    }
</script>