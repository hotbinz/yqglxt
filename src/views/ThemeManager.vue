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
        <Modal v-model="modal_show" width="500">
            <p slot="header" style="color:#2db7f5;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>主题信息</span>
            </p>
            <div style="text-align:center">
                <Row>
                    <Col span="18" push="6" style="text-align:left">
                        {{showData.author_name}} <span style="color:#bbbec4;">@{{showData.author_screen_name}}</span> - {{showData.create_at}}
                        <p style="line-height: 25px;">
                             {{showData.text}}<br />
                             <img src="showData.media" v-if="showData.media">
                        </p>
                        <p>
                            <Icon type="location" v-if="showData.author_location"></Icon> {{showData.author_location}}&nbsp;&nbsp;
                            <Icon type="arrow-return-right"></Icon> {{showData.retweet_count}}&nbsp;&nbsp;
                            <Icon type="android-favorite-outline"></Icon> {{showData.favorite_count}}&nbsp;&nbsp;
                        </p>
                    </Col>
                    <Col span="6" pull="18">
                        <Avatar icon="person" size="large" src="showData.author_profile_image_url"/>                        
                    </Col>
                </Row>
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
                modal_show: false,
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
                        width :'105'
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
                        width :'150px',
                        render: (h, column) => {
                            return [
                                    h('Button',{
                                        style: {
                                            color: '#57c5f7'
                                        },
                                        props: {
                                            type: 'text',
                                            shape: 'circle',
                                            size: "small",
                                            icon: 'ios-book',
                                        },
                                        attrs: {
                                            title: '详情'
                                        },
                                        on: {
                                            click: () => {
                                                this.showMore(column.index,column.row.id,column.row.url)
                                            }
                                        }
                                    }),
                                    h('Button', {
                                        style: {
                                            marginLeft: "10px",
                                            color: '#19be6b',
                                        },
                                        props: {
                                            type: 'text',
                                            shape: 'circle',
                                            size: "small",
                                            icon: 'ios-loop-strong',
                                            loading: this.data[column.index].syncing
                                        },
                                        attrs: {
                                            title: '同步'
                                        },
                                        on: {
                                            click: () => {
                                                this.syncTheme(column.index,column.row.url)
                                            }
                                        }
                                    }),
                                    h('Button', {
                                        style: {
                                            marginLeft: "10px",
                                            color: '#ed3f14',
                                        },
                                        props: {
                                            type: 'text',
                                            shape: 'circle',
                                            size:"small",
                                            icon: 'ios-trash-outline',
                                        },
                                        attrs: {
                                            title: '删除'
                                        },
                                        on: {
                                            click: () => {
                                                this.removeTheme(column.index,column.row.url)                                                
                                            },
                                        }
                                    })
                            ];
                        }
                    }

                ],
                data: [],
                showData: {

                },
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
                let param = 'size=' + this.page.pageSize + '&type=json'
                param += '&start=' + (this.page.current-1) * this.page.pageSize
                // if (type == 'paging' && this.page.current != 1) {
                //     param += '&last=' + this.page.minId
                // }
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
                    this.page.minId = gdata.data.total > 0?this.data[this.data.length - 1].id : 0;
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
                    if (response.data.result == 1) {
                        this.modal_delete = false    
                        this.modal_loading = false
                        this.data.splice(this.$Modal.index, 1)
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
                })
            },
            pageChange(page) {
                this.getList('paging')
            },
            searchTheme() {
                this.getList('searching')
            },
            showMore(index, id, url) {
                // window.open(url, "browser");
                this.modal_show = true
                this.axios.get("/theme/twitter/load.html?url=1&id="+id).then((response)=>{
                    if (response.data.result == 1) {
                        this.showData = response.data.data
                        console.info(this.showData);
                    }
                    else {
                        this.$Notice.error({
                            duration:2,
                            title: response.data.msg
                        });
                    } 
                });
            }
        }
    }
</script>