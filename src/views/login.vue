<style scoped>
.layout{
    position: relative;
    overflow: hidden;
    height:100%;
    background-color: #e7ecea;
}
.ivu-layout {
    width: 30%;
    height: 50%;
    margin: 0 auto;
    border-radius: 10px;
    position: absolute;
    top: 15%;
    left: 35%;
}
.ivu-layout .ivu-layout-header {
    color: #fff;
    background: #19be6b;
    border-radius: 10px 10px 0 0;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
}
</style>
<template>
  <div class="layout">
      <Layout>
            <Header>Login Form</Header>
            <Content>
                <Form ref="loginForm" :model="formData" :rules="ruleValidate" style="padding:30px;">
                    <FormItem label="用户名：" prop="username">
                        <Input type="text" v-model="formData.username" placeholder="Username">
                            <Icon type="ios-person-outline" slot="append"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem label="密码：" prop="password">
                        <Input type="password" v-model="formData.password" placeholder="Password">
                            <Icon type="ios-locked-outline" slot="append"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem style="text-align:right;">
                        <Button type="primary" @click="handleLogin('loginForm')">Signin</Button>
                    </FormItem>
                </Form>
            </Content>
      </Layout>
      
  </div>
</template>

<script>
    export default {
        data() {
            return {
                formData: {
                    'username':'',
                    'password':''
                },
                ruleValidate: {
                    username: [
                        { required: true, message: '用户名不能为空', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '密码不能为空', trigger: 'blur' }
                    ]
                },
            }
        },
        methods: {
            handleLogin(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.axios.post("/login.html",this.formData).then((response) => {
                            if (response.data.result == 1) {
                                this.$store.commit('setToken', this.formData.password);
                                this.$router.push({path:"/ThemeManager"});
                            }
                            else 
                                this.$Notice.error({
                                    duration:2,
                                    title: response.data.msg
                                });
                        })
                    }
                    else 
                        this.$Message.error('表单验证失败!');
                })
            }
        }
    }
</script>
