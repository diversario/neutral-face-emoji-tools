export function info(...msg) {
  console.log(`💬 ${msg.join(' ')}`)
}

export function error(...msg) {
  console.log(`🤬 ${msg.join(' ')}`)
}

export default {
  info,
  error
}
