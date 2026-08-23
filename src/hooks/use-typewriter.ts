import { useState, useEffect } from "react";

interface UseTypewriterOptions {
  words: string[];
  typingSpeed: number;
  deletingSpeed: number;
  pauseDuration: number;
  enabled?: boolean;
}

export function useTypewriter({ words, typingSpeed, deletingSpeed, pauseDuration, enabled = true }: UseTypewriterOptions) {
  const [currentText, setCurrentText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!enabled || !words || words.length === 0) return;

    const currentWord = words[wordIndex % words.length];

    const timer = setTimeout(
      () => {
        if (!isDeleting) {
          setCurrentText(currentWord.substring(0, currentText.length + 1));
          if (currentText === currentWord) {
            setTimeout(() => setIsDeleting(true), pauseDuration);
          }
        } else {
          setCurrentText(currentWord.substring(0, currentText.length - 1));
          if (currentText === "") {
            setIsDeleting(false);
            setWordIndex((prev) => (prev + 1) % words.length);
          }
        }
      },
      isDeleting ? deletingSpeed : typingSpeed,
    );

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseDuration, enabled]);

  return currentText;
}
