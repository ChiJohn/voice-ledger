export type SpeechResult = {
  text: string
  isFinal: boolean
}

function getRecognition(): any | null {
  const w = window as any
  return w.SpeechRecognition || w.webkitSpeechRecognition || null
}

export const speech = {
  isSupported(): boolean {
    return !!getRecognition()
  },
  async recognizeOnce(lang = 'zh-CN'): Promise<string> {
    return new Promise((resolve, reject) => {
      const SR = getRecognition()
      if (!SR) return resolve('')
      const rec = new SR()
      rec.lang = lang
      rec.interimResults = false
      rec.maxAlternatives = 1
      rec.onresult = (e: any) => {
        const t = e.results[0][0].transcript || ''
        resolve(t)
      }
      rec.onerror = (e: any) => reject(e.error)
      rec.onend = () => {}
      rec.start()
    })
  },
  startStream(onResult: (r: SpeechResult) => void, lang = 'zh-CN') {
    const SR = getRecognition()
    if (!SR) return null
    const rec = new SR()
    rec.lang = lang
    rec.interimResults = true
    rec.maxAlternatives = 1
    rec.onresult = (e: any) => {
      const last = e.results[e.results.length - 1]
      const t = last[0].transcript || ''
      onResult({ text: t, isFinal: last.isFinal })
    }
    rec.start()
    return rec
  },
  stop(rec: any) {
    if (rec && rec.stop) rec.stop()
  }
}