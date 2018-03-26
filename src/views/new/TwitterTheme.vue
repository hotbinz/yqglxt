<template>
    <Form :model="formItem" :label-width="80" style="padding:20px;">
        <FormItem label="推文地址">
            <Input v-model="formItem.twitterUrl" placeholder="请输入twitter主题地址"></Input>
        </FormItem>
        <FormItem>
            <Button type="primary">提交</Button>
            <Button type="ghost" style="margin-left: 8px" @click="windowClose">取消</Button>
        </FormItem>
    </Form>
</template>
<script>
    export default {
        data () {
            return {
                formItem: {
                    twitterUrl: ''
                }
            }
        },
        methods : {
            windowClose () {
                window.close();
            }
        }
    }
</script>
