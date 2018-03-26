<template>
    <Form :model="formItem" :label-width="80" style="padding:20px;">
        <FormItem label="名称">
            <Input v-model="formItem.name" placeholder="请输入任务名称"></Input>
        </FormItem>
        <FormItem label="内容">
            <Input v-model="formItem.content" type="textarea" :autosize="{minRows: 5,maxRows: 10}" placeholder="请输入任务内容..."></Input>
        </FormItem>
        <FormItem label="请选择用户">
            <Select v-model="model" filterable>
                <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </FormItem>
        <FormItem label="请选择附件">
            <Upload
                ref="upload"
                :show-upload-list="false"
                :default-file-list="defaultList"
                :on-success="handleSuccess"
                :format="['jpg','jpeg','png']"
                :max-size="2048"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :before-upload="handleBeforeUpload"
                type="drag"
                action="//jsonplaceholder.typicode.com/posts/"
                style="display: inline-block;width:58px;">
                <div style="width: 58px;height:58px;line-height: 58px;">
                    <Icon type="camera" size="20"></Icon>
                </div>
            </Upload>
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
                },
                TaskUser:0,
                cityList: [
                    {
                        value: '0',
                        label: '随机用户'
                    },
                    {
                        value: 'London',
                        label: 'London'
                    },
                    {
                        value: 'Sydney',
                        label: 'Sydney'
                    },
                    {
                        value: 'Ottawa',
                        label: 'Ottawa'
                    },
                    {
                        value: 'Paris',
                        label: 'Paris'
                    },
                    {
                        value: 'Canberra',
                        label: 'Canberra'
                    },
                    {
                        value: 'Paris',
                        label: 'Paris'
                    },
                    {
                        value: 'Canberra',
                        label: 'Canberra'
                    }
                ],
                model: '0'
            }
        },
        methods : {
            windowClose () {
                window.close();
            }
        }
    }
</script>
