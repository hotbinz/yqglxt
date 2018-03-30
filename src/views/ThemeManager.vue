<style scoped>
.layout {
    padding: 0px 10px;
}
.layout-header{
    background: none;
    padding: 20px;
    height:auto;
    line-height: 35px;
}
.layout-footer {
    padding: 20px 0px;
    text-align: center;
}
.layout .ivu-col{
    text-align: center;
}
.flexcenter{
    width:500px;
    margin:auto;
}
</style>
<template>
    <Layout class="layout">
        <Header class="layout-header">
            <Row type="flex" justify="center" class="flexcenter">
                <Col span="12" >
                    <Button type="primary" @click="NewTwitterTheme" icon="social-twitter">新建Twitter主题</Button>
                </Col>
                <Col span="12" style="border-left:1px solid #bbbec4">
                    <Button type="primary" disabled icon="social-youtube">新建Youtube主题</Button>
                </Col>
            </Row>
        </Header>
        <Content>
            <Table :height="tableHeight" :columns="columns" :data="data"></Table>
        </Content>
        <Footer class="layout-footer"><Page :total="40" size="small" show-total></Page></Footer>
    </Layout>
</template>
<script>
    export default {
        data () {
            return {
                tableHeight : document.documentElement.clientHeight - 175,
                columns: [
                    {
                        title: 'ID',
                        key: 'id'
                    },
                    {
                        title: '发布者',
                        key: 'author'
                    },
                    {
                        title: '推文内容',
                        key: 'text'
                    },
                    {
                        title: '创建时间',
                        key: 'create_at'
                    },
                    {
                        title: '点赞数',
                        key: 'favorite_count'
                    },
                    {
                        title: '转推数',
                        key: 'retweet_count'
                    },
                    {
                        title: '操作',
                        key: 'show_more',
                        align: 'center',
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
                    }

                ],
                data: [
                    {
                        name: 'John Brown',
                        age: 18,
                        address: 'New York No. 1 Lake Park',
                        date: '2016-10-03'
                    },
                    {
                        name: 'Jim Green',
                        age: 24,
                        address: 'London No. 1 Lake Park',
                        date: '2016-10-01'
                    },
                    {
                        name: 'Joe Black',
                        age: 30,
                        address: 'Sydney No. 1 Lake Park',
                        date: '2016-10-02'
                    },
                    {
                        name: 'Jon Snow',
                        age: 26,
                        address: 'Ottawa No. 2 Lake Park',
                        date: '2016-10-04'
                    },
                    {
                        name: 'John Brown',
                        age: 18,
                        address: 'New York No. 1 Lake Park',
                        date: '2016-10-03'
                    },
                    {
                        name: 'Jim Green',
                        age: 24,
                        address: 'London No. 1 Lake Park',
                        date: '2016-10-01'
                    },
                    {
                        name: 'Joe Black',
                        age: 30,
                        address: 'Sydney No. 1 Lake Park',
                        date: '2016-10-02'
                    },
                    {
                        name: 'Jon Snow',
                        age: 26,
                        address: 'Ottawa No. 2 Lake Park',
                        date: '2016-10-04'
                    }
                ]
            }
        },
        mounted() {
            const that = this;
            window.onresize = () => {
                that.tableHeight = document.documentElement.clientHeight - 175
            }    
            //先登录再取
            this.axios.post("/login.html",{username:'admin@ovio.com',password: 'Ovio123<>?'}).then((response)=>{
                if(response.data.result == 1) {
                    this.axios.get("/theme/twitter/list.html?size=20&type=json").then((gdata)=>{
                        console.info(gdata.data);  
                    });
                }                
            }).catch(function (response) {
                console.log(response);
            });
            
        },
        methods:{
            NewTwitterTheme() {
                window.open("#/New/TwitterTheme","modal" ,"width=400,height=200,resizable=false");
            }
        }
    }
</script>