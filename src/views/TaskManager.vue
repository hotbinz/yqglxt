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
            <Table :height="tableHeight" :columns="columns" :data="data"></Table>
        </Content>
        <Footer class="layout-footer"><Page :total="40" size="small" show-total></Page></Footer>
    </Layout>
</template>
<script>
    export default {
        data () {
            return {
                tableHeight : document.documentElement.clientHeight - 195,
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