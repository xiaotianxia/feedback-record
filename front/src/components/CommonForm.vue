<template>
    <div class="form">
        <el-form :model="formData" :rules="rules">
            <el-form-item label="反馈类型">
                <el-radio-group v-model="formData.type" @change="onChange" size="mini">
                    <el-radio :label="0">问题反馈 <i class="ali-icon ali-icon-feedback"></i></el-radio>
                    <el-radio :label="1">点赞 <i class="ali-icon ali-icon-thumbup"></i> </el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="" prop="word">
                <el-input type="textarea" v-model="formData.word" @change="onChange" :autosize="{ minRows: 2, maxRows: 5}" :placeholder="['请输入问题描述', '请输入您要说的话'][formData.type]" size="mini"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    data () {
        return {
            formData: {
                type: 0,
                word: ''
            },

            rules: {
                word: [
                    { max: 500, message: '有点长...', trigger: 'change' }
                ]
            }
        }
    },

    methods: {
        onChange () {
            this.$emit('change', {
                type: this.formData.type,
                word: this.formData.word
            });
        },

        resetForm () {
            this.formData.type = 0;
            this.formData.word = '';
        }
    }
}
</script>

