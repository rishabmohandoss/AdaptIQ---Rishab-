window.AdaptIQLive = (() => {
  let socket, context, mic, node, source, expiry, connecting = false, ready = false, nextPlay = 0, active = new Set(), generation = 0;
  const status = value => { document.getElementById('live-status').textContent = value; };
  function stopAudio() { for (const item of active) { try { item.stop(); } catch {} } active.clear(); nextPlay = 0; }
  function stop() {
    generation++; connecting = false; ready = false; clearTimeout(expiry); stopAudio();
    if (socket) { socket.onclose = null; socket.close(); socket = null; }
    node?.disconnect(); source?.disconnect(); mic?.getTracks().forEach(t => t.stop());
    context?.close(); mic = node = source = context = null;
    document.getElementById('live-start').disabled = false;
    status('Practice ended. This conversation was not saved by AdaptIQ.');
  }
  async function start(jobId) {
    if (connecting || ready) return;
    connecting = true; const run = ++generation;
    document.getElementById('live-start').disabled = true;
    try {
      status('Connecting…');
      context = new AudioContext(); await context.resume();
      const input = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true }, video: false });
      if (run !== generation) { input.getTracks().forEach(t => t.stop()); return; }
      mic = input;
      const response = await fetch(`/api/jobs/${jobId}/live-token`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
      const data = await response.json(); if (run !== generation) return;
      if (!response.ok) throw new Error(data.error);
      await context.audioWorklet.addModule('/pcm-worklet.js'); if (run !== generation) return;
      socket = new WebSocket('wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContentConstrained?access_token=' + encodeURIComponent(data.token));
      socket.onopen = () => socket.send(JSON.stringify({ setup: { model: data.model, generationConfig: { responseModalities: ['AUDIO'] } } }));
      let messages = Promise.resolve();
      socket.onmessage = event => { messages = messages.then(async () => {
        if (run !== generation) return;
        const payload = JSON.parse(typeof event.data === 'string' ? event.data : await event.data.text());
        if (run !== generation) return;
        if (payload.error) throw new Error('Live practice returned an error. Please reconnect.');
        if (payload.setupComplete) {
          ready = true; connecting = false; status('Connected · microphone on. Speak naturally. Use headphones to avoid echo.');
          source = context.createMediaStreamSource(mic); node = new AudioWorkletNode(context, 'microphone-pcm');
          node.port.onmessage = event => {
            if (!ready || socket?.readyState !== WebSocket.OPEN || socket.bufferedAmount > 512000) return;
            const samples = event.data, bytes = new Uint8Array(samples.length * 2), view = new DataView(bytes.buffer);
            samples.forEach((v,i) => view.setInt16(i * 2, Math.max(-1, Math.min(1,v)) * 32767, true));
            socket.send(JSON.stringify({ realtimeInput: { audio: { data: btoa(String.fromCharCode(...bytes)), mimeType: `audio/pcm;rate=${context.sampleRate}` } } }));
          };
          source.connect(node); node.connect(context.destination);
          socket.send(JSON.stringify({ realtimeInput: { text: 'Please introduce yourself briefly and ask the first interview question.' } }));
        }
        if (payload.serverContent?.interrupted) stopAudio();
        for (const part of payload.serverContent?.modelTurn?.parts || []) {
          if (!part.inlineData?.mimeType?.startsWith('audio/pcm')) continue;
          const bytes = Uint8Array.from(atob(part.inlineData.data), c => c.charCodeAt(0));
          const view = new DataView(bytes.buffer), buffer = context.createBuffer(1, Math.floor(bytes.length / 2), 24000);
          const samples = buffer.getChannelData(0); for (let i=0;i<samples.length;i++) samples[i] = view.getInt16(i*2,true) / 32768;
          const output = context.createBufferSource(); output.buffer = buffer; output.connect(context.destination);
          active.add(output); output.onended = () => active.delete(output);
          nextPlay = Math.max(nextPlay, context.currentTime); output.start(nextPlay); nextPlay += buffer.duration;
        }
      }).catch(e => { if (run === generation) { stop(); status(e.message); } }); };
      socket.onerror = () => { stop(); status('Live connection failed. Please try again.'); };
      socket.onclose = () => stop();
      expiry = setTimeout(() => { stop(); status('Eight-minute practice finished. Start another when you are ready.'); }, 8 * 60000);
    } catch (e) { if (run === generation) { stop(); status(e.message || 'Could not connect.'); } }
  }
  window.addEventListener('pagehide', stop);
  return { start, stop };
})();
