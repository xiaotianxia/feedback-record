<template>
    <el-dialog
            :visible.sync="show"
            fullscreen
            center
            append-to-body
            title="预览"
            @close="onClose">
        <common-form v-if="!onlyPreview" ref="formComp" @change="onFormChange"></common-form>
        <div ref="fbrPlayerWrapper"></div>
        <div slot="footer">
            <el-button v-if="!onlyPreview" :loading="loading" type="primary" @click="onConfirm" size="mini">提交</el-button>
            <el-button @click="onCancel" size="mini">取消</el-button>
        </div>
    </el-dialog>
</template>

<script>
import rrwebPlayer from 'rrweb-player';
import CommonForm from './CommonForm';
import { trim, get } from 'lodash-es';
import net from '../net';
import Vue from 'vue';

export default {
    data () {
        return {
            show: false,
            loading: false,
            type: 0,
            word: ''
        }
    },

    props: {
        onlyPreview: {
            type: Boolean,
            default: false
        },

        submitter: {
            type: Object,
            default: () => {}
        },

        // 系统名称
        sysName: {
			type: String,
			default: ''
		}
    },

    components: {
        CommonForm
    },

    methods: {
        showDialog (events) {
            this.show = true;
            this.events = events;
            this.$nextTick(() => {
                if (!this.onlyPreview) {
                    this.restForm();
                }
                this.$playerWrapper = this.$refs.fbrPlayerWrapper;
                this.remove(this.$playerWrapper);
                this.play(events);
            });

            this.$emit('open');
        },

        onClose () {
            if (this.onlyPreview) { return; }
            this.$emit('close');
        },

        //keep only one childnode
        remove (wrapper) {
            if(wrapper.childNodes.length) {
                wrapper.removeChild(wrapper.firstChild);
            }
        },

        play (events) {
            try {
                new rrwebPlayer({
                    target: this.$playerWrapper,
                    data: {
                        events,
                        autoPlay: true
                    }
                });
            } catch {
                this.$message.error('抱歉，回放出问题了-_-||');
            }
        },

        onFormChange (e) {
            this.type = e.type || 0;
            this.word = e.word;
        },

        onConfirm () {
            let param = {
                type: this.type,
                media: 1,
                data: JSON.stringify(this.events),
                word: trim(this.word),
                submitter_id: get(this.submitter, 'id') || 0,
                submitter_name: get(this.submitter, 'name') || '',
                sys_name: this.sysName,
                url: window.location.href,
                device: JSON.stringify({
                    screen: {
                        width: window.screen.width,
                        height: window.screen.height
                    },
                    ua: navigator.userAgent
                })
            };
            this.loading = true;
            Vue.toasted && Vue.toasted.show('数据量较大，请耐心等待一会~');
            net.add({
                ...param
            }).then(res => {
                this.loading = false;
                if(res.data.status === 0) {
                    this.show = false;
                    this.$message.success('提交成功');
                }
            });
        },

        onCancel () {
            this.show = false;
            this.events = [];
        },

        restForm () {
            this.loading = false;
            this.$refs.formComp.resetForm();
        }
    }
}
</script>

<style scoped lang="less">
    .el-dialog__wrapper {
        /deep/ .el-dialog__close {
            font-size: 40px;
        }
        /deep/ .el-dialog__footer {
            text-align: right;
            
            .el-button--mini,
            .el-button--mini.is-round {
                padding: 7px 15px;
            }
        }
    }
    .form {
        margin-bottom: 10px;
    }
</style>

