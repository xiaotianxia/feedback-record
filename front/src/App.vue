<template>
    <div id="app">
        <router-view :key="$route.fullPath"></router-view>
        <feedback-recorder snapshot-wrapper-id="app" sysName="测试"></feedback-recorder>
    </div>
</template>

<script>
import FeedbackRecorder from './components/FeedbackRecorder';

export default {
    name: 'app',

    components: {
        FeedbackRecorder
    }
}
</script>

