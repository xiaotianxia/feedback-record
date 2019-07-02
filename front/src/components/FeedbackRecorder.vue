<template>
	<div v-if="show" :class="{'rr-block': block}" class="fbr-wrapper" data-html2canvas-ignore>
		<div v-show="toggle == 0">
			<div class="btns">
				<!-- player模式没有此处 -->
				<el-button v-if="!started" @click="onRecord" type="success" circle icon="ali-icon ali-icon-record" tilte="录屏" size="mini"></el-button>
				<el-button v-if="started" @click="onEnd" type="danger" circle icon="ali-icon ali-icon-jieshu" title="结束" size="mini"></el-button>
				<el-button @click="onSnapShot" :disabled="started" :loading="snapshotLoading" type="danger" circle icon="ali-icon ali-icon-camera" title="截图" size="mini"></el-button>
			</div>

			<div v-if="player" class="file-wrapper">
				<el-button v-if="download && saved && events.length" @click="onPreview" type="warning" circle icon="ali-icon ali-icon-yulan" title="预览" size="mini"></el-button>
				<el-button class="select" type="primary" circle icon="ali-icon ali-icon-openfile" title="播放录制文件" size="mini">
					<input ref="fileInput" type="file" @change="onReadFile">
				</el-button>
			</div>
		</div>

		<timer @hook:mounted="onTimerMounted" ref="timer"></timer>

		<div class="toggle" @click="onToggle">
			<i class="ali-icon" :class="`ali-icon-${toggle == 0 ? 'shrink' : 'magnify'}`"></i>
		</div>

		<player-dialog ref="playerDialog" form :submitter="submitter" :sys-name="sysName" @open="onOpenPlayerDialog" @close="onClosePlayerDialog"></player-dialog>
		<snapshot-dialog ref="snapshotDialog" :submitter="submitter" :sys-name="sysName"></snapshot-dialog>
	</div>
</template>

<script>
import * as rrweb from 'rrweb';
import hotkeys from 'hotkeys-js';
import html2canvas from 'html2canvas';
import { readTextFile, downloadFile } from '../utils/utils';
import PlayerDialog from './PlayerDialog';
import SnapshotDialog from './SnapshotDialog';
import Timer from './Timer';

import Vue from 'vue';
import Toasted from 'vue-toasted';
Vue.use(Toasted, {
    position: 'bottom-center',
    theme: "toasted-primary",
    duration: 1 * 1000
});

export default {
	name: 'feedbackRecorder',

	data () {
		return {
            show: false,
			events: [],
			started: false,
            saved: false,
			toggle: 0,
            snapshotLoading: false
		}
	},

	props: {
        // 是否下载录制json文件
		download: {
			type: Boolean,
			default: false
        },
        
        // 是否带播放功能：可选取文件播放
		player: {
			type: Boolean,
			default: false
        },

        // 是否屏蔽挂件
        block: {
			type: Boolean,
			default: true
		},

		submitter: {
			type: Object,
			default: () => {}
		},

		// 系统名称
        sysName: {
			type: String,
			default: ''
		},

		snapshotWrapperId: {
			type: String,
			default: 'app'
		}
	},

	components: {
		PlayerDialog,
		SnapshotDialog,
		Timer
	},

	methods: {
		onRecord () {
			let self = this;
			this.$timer.start();
			this.started = true;
			this.saved = false;
            Vue.toasted && Vue.toasted.show('再次点击按钮结束录制');
            let stopRecord = rrweb.record({
				emit(event) {
					self.events.push(event);
					// TODO: 停止录制
					// if (self.events.length > 100) {
					// 	stopRecord();
					// }
				}
			});
			this.stopRecord = stopRecord;
		},

		onEnd () {
            //stop recording
            this.stopRecord && this.stopRecord();
			if(this.events.length < 2) {
                this.$notify.error({
                    title: '好像出错了-_-||',
                    message: '录制数据为空'
                });
				return;
			}
			this.$timer.stop();
			this.started = false;
			this.saved = true;
            if (this.download) {
				downloadFile(JSON.stringify(this.events), `record_files_${new Date().getTime()}.json`);
			}
			this.onPreview(this.events);
		},

		onSnapShot () {
			let node = document.getElementById(this.snapshotWrapperId) || document.body;
				// allowTaint = !this.hasCrossDomainImages(node);
			// 解决“Tainted canvases may not be exported”问题
			// 检查DOM里是否有跨域图片， 若有则allowTaint:false,canvas不显示图片
			// 否则allowTaint:true,显示图片
			this.snapshotLoading = true;
			html2canvas(node, {
				// useCORS: true,
				// allowTaint: allowTaint, // 是否允许跨域图片
				allowTaint: false, // 是否允许跨域图片
				x: document.scrollingElement.scrollLeft,
				y: document.scrollingElement.scrollTop,
				scale: 1,
				logging: false
			}).then(canvas => {
				this.snapshotLoading = false;
				this.$refs.snapshotDialog.showDialog(canvas);
			});
		},

		// hasCrossDomainImages (node) {
		// 	let host = location.host,
		// 		regExp = new RegExp(host),
		// 		imgs = node.querySelectorAll('img');

		// 	return !Array.from(imgs).every(item => {
		// 		regExp.test(item.src);
		// 	});
		// },

		onPreview () {
			this.showPlayerDialog(this.events || []);
		},

		onReadFile () {
			let file = this.$fileInput.files[0],
				fileName = file.name.substr(file.name.lastIndexOf('.') + 1);
			if (fileName !== 'json') {
				this.$message.error('文件类型有误');
				return;
			}
			readTextFile(file, events => {
				if (!events || !Array.isArray(events) || !events.length) {
					this.$message.error('无效的文件');
					return;
				}
				this.showPlayerDialog(events);
				this.$fileInput.value = '';
			});
		},

		showPlayerDialog (events) {
			this.$refs.playerDialog.showDialog(events);
        },
        
        onClosePlayerDialog () {
			this.events = [];
            this.toggle = 0;
            this.show = false;
		},
		
		onOpenPlayerDialog () {
			this.toggle = 1;
		},

        onToggle () {
            this.toggle = Number(!this.toggle);
		},
		
		onTimerMounted () {
			this.$timer = this.$refs.timer;
			this.$fileInput = this.$refs.fileInput;
		}
	},

	mounted () {
        
        hotkeys('shift+f+b', e => {
            e.preventDefault();
            this.show = !this.show;
        });
	}
}
</script>

<style lang="less">
	// 全局样式
	//rrweb style
	@import '~rrweb/dist/rrweb.min.css';
	//rrweb-player style
	@import '~rrweb-player/dist/style.css';
	// custom style
	@import '../style/index.less';
</style>

<style scoped lang="less">
	.fbr-wrapper {
		position: fixed;
		right: 10px;;
		top: 55px;
		padding: 10px;
		background-color: rgba(30, 32, 44, .9);
		box-shadow: 0 1px 6px 0 rgba(0, 0, 0, .4);
		color: #fff;
        text-align: center;
		user-select: none;
		z-index: 9999;
		
		&:hover {
            .toggle {
                display: block;
            }
        }
        .toggle {
            display: none;
            position: absolute;
            bottom: 0;
            right: 0;
            width: 20px;
            height: 20px;
            cursor: pointer;
		}
		.btns {
			/deep/ i[class^=el-icon-] {
				font-size: 16px;
			}
		}
    }
    .file-wrapper {
        text-align: center;
        margin-top: 10px;
		
		.select {
            position: relative;
            overflow: hidden;
            input {
                position: absolute;
                font-size: 100px;
                right: 0;
                top: 0;
                opacity: 0;
                cursor: pointer;
            }
        }
    }
</style>
