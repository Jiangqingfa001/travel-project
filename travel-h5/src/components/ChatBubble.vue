<template>
  <div class="chat-bubble" :class="messageClass">
    <div class="bubble-content">
      <div class="message-text" v-if="message.role === 'user'">{{ message.content }}</div>
      <div class="message-text ai-message markdown-body" v-else v-html="renderedContent"></div>
    </div>
    <div class="message-time" v-if="showTime">{{ formatTime }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps({
  message: {
    type: Object,
    required: true
  }
})

const messageClass = computed(() => {
  return props.message.role === 'user' ? 'user-message' : 'ai-message'
})

const showTime = computed(() => {
  return props.message.timestamp && props.message.content
})

const renderedContent = computed(() => {
  if (!props.message.content) return ''
  return marked.parse(props.message.content)
})

const formatTime = computed(() => {
  if (!props.message.timestamp) return ''
  const date = new Date(props.message.timestamp)
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
})
</script>

<style scoped>
.chat-bubble {
  display: flex;
  flex-direction: column;
  max-width: 80%;
}

.user-message {
  align-self: flex-end;
  align-items: flex-end;
}

.ai-message {
  align-self: flex-start;
  align-items: flex-start;
}

.bubble-content {
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 15px;
  line-height: 1.5;
  word-break: break-word;
}

.user-message .bubble-content {
  background: #1989fa;
  color: #fff;
  border-bottom-right-radius: 4px;
}

.ai-message .bubble-content {
  background: #f5f5f5;
  color: #323233;
  border-bottom-left-radius: 4px;
}

.markdown-body :deep(h1) { font-size: 18px; font-weight: 700; margin: 12px 0 8px; border-bottom: 1px solid #e8e8e8; padding-bottom: 6px; }
.markdown-body :deep(h2) { font-size: 16px; font-weight: 700; margin: 10px 0 6px; }
.markdown-body :deep(h3) { font-size: 15px; font-weight: 600; margin: 8px 0 4px; }
.markdown-body :deep(p) { margin: 6px 0; line-height: 1.6; }
.markdown-body :deep(ul), .markdown-body :deep(ol) { padding-left: 20px; margin: 6px 0; }
.markdown-body :deep(li) { margin: 3px 0; line-height: 1.5; }
.markdown-body :deep(strong) { font-weight: 700; color: #1989fa; }
.markdown-body :deep(code) { background: #e8e8e8; padding: 2px 6px; border-radius: 4px; font-size: 13px; }
.markdown-body :deep(pre) { background: #2d2d2d; color: #f8f8f2; padding: 12px; border-radius: 8px; overflow-x: auto; margin: 8px 0; }
.markdown-body :deep(pre code) { background: none; padding: 0; color: inherit; }
.markdown-body :deep(blockquote) { border-left: 3px solid #1989fa; padding-left: 12px; margin: 8px 0; color: #666; }
.markdown-body :deep(hr) { border: none; border-top: 1px solid #e8e8e8; margin: 12px 0; }

.message-time {
  font-size: 11px;
  color: #999;
  margin-top: 4px;
  padding: 0 4px;
}

.typing {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>