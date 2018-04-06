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
                    <Input v-model="searchVal" @on-enter="searchTheme" placeholder="请输入搜索内容...">
                        <Button slot="append" icon="ios-search" @click="searchTheme">搜索</Button>
                    </Input>
                </Col>
            </Row>            
        </Header>
        <Content>
            <Table :height="tableHeight" :loading="loading" :columns="columns" :data="data"></Table>
        </Content>
        <Footer class="layout-footer"><Page :total="page.total" size="small" show-total :current.sync="page.current" @on-change="pageChange"></Page></Footer>
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
                searchVal:'',
                loading: true,
                modal_delete: false,
                modal_loading: false,
                columns: [
                    {
                        title: 'ID',
                        key: 'id',
                        align: 'center',
                        width :'50'
                    },
                    {
                        title: '发布者',
                        key: 'author_name',
                        align: 'center',
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
                        align: 'center',
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
                        align: 'center',
                        width :'110'
                    },
                    {
                        title: '点赞数',
                        key: 'favorite_count',
                        align: 'center',
                        width :'80'                    
                    },
                    {
                        title: '转推数',
                        key: 'retweet_count',
                        align: 'center',
                        width :'80',
                    },
                    {
                        title: '操作',
                        key: 'show_more',
                        align: 'center',
                        width :'160px',
                        render: (h, column) => {
                            return [
                                    h('Button', {
                                        props: {
                                            type: 'success',
                                            shape: 'circle',
                                            size: "small",
                                            loading: this.data[column.index].syncing
                                        },
                                        on: {
                                            click: () => {
                                                this.syncTheme(column.index,column.row.url)
                                            }
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
                                                this.removeTheme(column.index,column.row.url)                                                
                                            },
                                        }
                                    }, '删除')
                            ];
                        }
                    }

                ],
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
            const that = this;
            window.onresize = () => {
                that.tableHeight = document.documentElement.clientHeight - 175
            }    
            this.getList();
            
        },
        methods:{
            getList(type) {
                //先登录再取
                this.axios.post("/login.html",{username:'admin@ovio.com',password: 'Ovio123<>?'}).then((response)=>{
                    if(response.data.result == 1) {
                        let param = 'size=' + this.page.pageSize + '&type=json'
                        if (this.page.current != 1) {
                            param += '&last=' + this.page.minId
                        }
                        if (this.searchVal != '') {
                            param += '&name=' + this.searchVal
                        }
                        this.axios.get("/theme/twitter/list.html?"+param).then((gdata)=>{
                            this.loading = false;
                            // 翻页操作，不更新total
                            if (type != 'paging') {
                                this.page.total = gdata.data.total;
                            }
                            this.data = gdata.data.datas;
                            this.page.minId = this.page.total > 0?this.data[this.data.length - 1].id : 0;
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
                   that.getList();    
                };
            },
            //同步主题
            syncTheme(index, url) {
                this.$set(this.data[index],'syncing', true);
                this.axios.post("/theme/twitter/sync.html",{"url":url}).then((response)=>{
                    this.$set(this.data[index],'syncing', false);
                    if(response.data.result == 1) {
                        this.$Notice.success({
                            duration:2,
                            title: response.data.msg
                        });
                    }
                    else {
                        this.$Notice.error({
                            duration:2,
                            title: response.data.msg
                        });
                    }                    
                }); 
            },
            //删除主题
            removeTheme(index, url) {
                this.modal_delete = true
                this.$Modal.index = index
                this.$Modal.url = url
            },
            ActionDel() {
                this.modal_loading = true;
                this.axios.post("/theme/twitter/delete.html",{"url":this.$Modal.url}).then((response)=>{
                    if(response.data.result == 1) {
                        this.modal_delete = false    
                        this.modal_loading = false
                        this.data.splice(this.$Modal.index, 1)
                    }
                    else {
                        this.$Notice.error({
                            duration:2,
                            title: response.data.msg
                        });
                    }                    
                })
            },
            pageChange(page) {
                this.getList('paging')
            },
            searchTheme() {
                this.getList('searching')
            }
        }
    }
</script>