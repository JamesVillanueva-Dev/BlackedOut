let enabled = false; // off by default

// Listen for toolbar toggle messages
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "toggle") {
    enabled = !enabled;
    console.log("Text Blackout enabled:", enabled);
  }
});

document.addEventListener("mouseup", function() {
  if (!enabled) return; // ignore highlights when disabled

  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  const text = selection.toString().trim();
  if (text.length === 0) return;

  const parent = range.commonAncestorContainer.parentElement;
  const excludeTags = ["A", "BUTTON", "INPUT", "TEXTAREA", "IMG"];
  if (excludeTags.includes(parent.tagName)) return;

  const span = document.createElement("span");
  span.style.color = "black";
  span.style.backgroundColor = "black";
  span.dataset.blackedOut = "true";
  span.title = "Click to toggle blackout";

  try {
    range.surroundContents(span);
  } catch (e) {
    console.warn("Selection too complex to wrap.");
    return;
  }

  selection.removeAllRanges();

  span.addEventListener("click", function(e) {
    e.stopPropagation();
    if (span.dataset.blackedOut === "true") {
      span.style.color = "";
      span.style.backgroundColor = "";
      span.dataset.blackedOut = "false";
      span.title = "";
    } else {
      span.style.color = "black";
      span.style.backgroundColor = "black";
      span.dataset.blackedOut = "true";
      span.title = "Click to toggle blackout";
    }
  });
});
