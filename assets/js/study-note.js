(() => {
  const note = document.querySelector('.study-note');
  const closeButton = document.getElementById('close-all');
  const status = document.getElementById('math-status');
  if (!note || !closeButton || !status) return;

  const details = Array.from(note.querySelectorAll('details'));
  closeButton.addEventListener('click', () => {
    for (const item of details) item.open = false;
  });
  closeButton.hidden = false;

  function showMathFallback() {
    status.textContent = '数式を読み込めなかったため、TeX表記で表示しています。インターネット接続を確認して再読み込みしてください。';
    status.hidden = false;
  }

  // Wait for initial typesetting, then serialize updates for opened answers.
  let queue = Promise.resolve();
  for (const item of details) {
    item.addEventListener('toggle', () => {
      const math = window.MathJax;
      if (!item.open || !math?.startup?.promise || !math.typesetPromise) return;
      queue = queue.then(() => math.startup.promise)
        .then(() => math.typesetPromise([item]))
        .catch(showMathFallback);
    });
  }
  window.addEventListener('load', () => {
    const ready = window.MathJax?.startup?.promise;
    if (!ready) {
      showMathFallback();
      return;
    }
    ready.then(() => { status.hidden = true; }).catch(showMathFallback);
  }, { once: true });
})();
