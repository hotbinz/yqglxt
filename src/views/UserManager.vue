<style scoped>
.layout {
    padding: 10px;
    padding-right:0px;
}
.layout-footer {
    padding: 10px 0px;
    text-align: center;
}
.ivu-card{
    width:190px;
    height:130px;
    float: left;
    margin-right:15px;
    margin-bottom:15px;
}
</style>
<template>
    <Layout class="layout">
        <Content :style="{height:tableHeight+'px',overflow: 'auto',padding:'5px',paddingRight:'0px'}">
            <Card :bordered="false" v-for="item in data" :key="item.name">
                <p slot="title">Borderless card</p>
                <p>Content of card</p>     
            </Card>
        </Content>
        <Footer class="layout-footer"><Page :total="40" size="small" show-total></Page></Footer>
    </Layout>
</template>
<script>
    export default {
        data () {
            return {
                tableHeight : document.documentElement.clientHeight - 135,
                loading:false,
                columns: [
                    {
                        title: 'Name',
                        key: 'name'
                    },
                    {
                        title: 'Age',
                        key: 'age'
                    },
                    {
                        title: 'Address',
                        key: 'address'
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
            const that = this
            window.onresize = () => {
                that.tableHeight = document.documentElement.clientHeight - 155
            }
        },
        methods :{
            NewEvent() {
                this.loading = true;
                var that = this;
                setTimeout(()=>{this.loading = false;},2000);
                //var type = this.$route.params.type;
                //window.open("#/New/"+type+"Task","modal" ,"width=400,height=200,resizable=false");
            }
        }
    }
</script>