import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@radix-ui/react-separator";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, Edit3Icon, X, Zap } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { RiGoogleLine } from "react-icons/ri";

export default function AIToolTip({ enabled }: { enabled: boolean }) {
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [additionalText, setAdditionalText] = useState<string | null>(null);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const { t } = useTranslation();
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();
  
    if (text && text.length > 0) {
      setSelectedText(text);
      const range = selection?.getRangeAt(0);
      const rect = range?.getBoundingClientRect();
      if (rect) {
        setTooltipPosition({
          x: rect.left + rect.width / 2,
          y: rect.top - 10,
        });
        if (rect.top - 10 < 0) {
          setIsTooltipVisible(false);
        } else {
          setIsTooltipVisible(true);
        }
      }
    } else {
      setIsTooltipVisible(false);
    }
  }, []);  

  const handleMouseDown = useCallback(() => {
    setIsTooltipVisible(false);
  }, []);

  useEffect(() => {
    document.addEventListener("mouseup", handleTextSelection);
    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("mouseup", handleTextSelection);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [handleTextSelection, handleMouseDown]);

  if (!enabled) {
    return null;
  }

  return (
    <>
      {selectedText && tooltipPosition && (
        <>
          <Tooltip open={isTooltipVisible}>
            <TooltipTrigger asChild>
              <span
                style={{
                  position: "fixed",
                  left: `${tooltipPosition.x}px`,
                  top: `${tooltipPosition.y}px`,
                  pointerEvents: "none",
                }}
              />
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="flex space-x-2 z-[10000000000000]"
            >
              <Button
                onClick={() => {
                  window.open(
                    `https://www.google.com/search?q=${selectedText}`
                  );
                  window.open(`https://chatgpt.com/?q=${selectedText}`);
                  window.open(`https://www.perplexity.ai/?q=${selectedText}`);
                  window.open(`https://claude.ai/new?q=${selectedText}`);
                  setIsTooltipVisible(false);
                }}
                size="icon"
                variant="ghost"
              >
                <Zap className="text-primary" />
              </Button>
              <Button
                onClick={() => {
                  window.open(
                    `https://www.google.com/search?q=${selectedText}`
                  );
                  setIsTooltipVisible(false);
                }}
                size="icon"
                variant="ghost"
              >
                <RiGoogleLine />
              </Button>

              <Button
                onClick={() => {
                  window.open(`https://chatgpt.com/?q=${selectedText}`);
                  setIsTooltipVisible(false);
                }}
                size="icon"
                variant="ghost"
              >
                <ChatGPTSVG />
              </Button>
              <Button
                onClick={() => {
                  window.open(`https://www.perplexity.ai/?q=${selectedText}`);
                  setIsTooltipVisible(false);
                }}
                size="icon"
                variant="ghost"
              >
                <PerplexitySVG />
              </Button>
              <Button
                onClick={() => {
                  window.open(`https://claude.ai/new?q=${selectedText}`);
                  setIsTooltipVisible(false);
                }}
                size="icon"
                variant="ghost"
              >
                <ClaudeSVG />
              </Button>
              <Separator
                orientation="vertical"
                className="shrink-0 bg-border min-h-[80%] w-[1px]"
              />
              <Button
                onClick={() => {
                  window.navigator.clipboard.writeText(selectedText);
                  setIsTooltipVisible(false);
                }}
                size="icon"
                variant="ghost"
              >
                <Copy />
              </Button>

              <Button
                onClick={() => {
                  setAdditionalText('"' + selectedText + '"');
                  setIsTooltipVisible(false);
                }}
                size="icon"
                variant="ghost"
              >
                <Edit3Icon />
              </Button>
            </TooltipContent>
          </Tooltip>
        </>
      )}
      <Modal
        modalOpen={additionalText !== null}
        onModalClose={() => setAdditionalText(null)}
      >
        <h2 className="font-semibold text-center mb-4">{t("tooltip.query")}</h2>
        <Label className="mb-1">{t("tooltip.queryLabel")}</Label>
        <Textarea
          value={additionalText ? additionalText : ""}
          onChange={(e) => setAdditionalText(e.target.value)}
        />
        <div className="flex gap-4 justify-center items-center mt-4">
          <Button
            onClick={() => {
              window.open(`https://www.google.com/search?q=${additionalText}`);
              window.open(`https://chatgpt.com/?q=${additionalText}`);
              window.open(`https://www.perplexity.ai/?q=${additionalText}`);
              window.open(`https://claude.ai/new?q=${additionalText}`);
              setAdditionalText(null);
            }}
            size="icon"
            variant={"outline"}
          >
            <Zap className="text-primary" />
          </Button>
          <Button
            onClick={() => {
              window.open(`https://www.google.com/search?q=${additionalText}`);
              setAdditionalText(null);
            }}
            size="icon"
            variant={"outline"}
          >
            <RiGoogleLine />
          </Button>

          <Button
            onClick={() => {
              window.open(`https://chatgpt.com/?q=${additionalText}`);
              setAdditionalText(null);
            }}
            size="icon"
            variant={"outline"}
          >
            <ChatGPTSVG />
          </Button>
          <Button
            onClick={() => {
              window.open(`https://www.perplexity.ai/?q=${additionalText}`);
              setAdditionalText(null);
            }}
            size="icon"
            variant={"outline"}
          >
            <PerplexitySVG />
          </Button>
          <Button
            onClick={() => {
              window.open(`https://claude.ai/new?q=${additionalText}`);
              setAdditionalText(null);
            }}
            size="icon"
            variant={"outline"}
          >
            <ClaudeSVG />
          </Button>
        </div>
      </Modal>
    </>
  );
}

const ChatGPTSVG = () => {
  return (
    <svg
      width="2500"
      height="2500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      strokeWidth="1.5"
      className="h-6 w-6"
      viewBox="-0.17090198558635983 0.482230148717937 41.14235318283891 40.0339509076386"
    >
      <text x="-9999" y="-9999">
        ChatGPT
      </text>
      <path
        d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835A9.964 9.964 0 0 0 18.306.5a10.079 10.079 0 0 0-9.614 6.977 9.967 9.967 0 0 0-6.664 4.834 10.08 10.08 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 7.516 3.35 10.078 10.078 0 0 0 9.617-6.981 9.967 9.967 0 0 0 6.663-4.834 10.079 10.079 0 0 0-1.243-11.813zM22.498 37.886a7.474 7.474 0 0 1-4.799-1.735c.061-.033.168-.091.237-.134l7.964-4.6a1.294 1.294 0 0 0 .655-1.134V19.054l3.366 1.944a.12.12 0 0 1 .066.092v9.299a7.505 7.505 0 0 1-7.49 7.496zM6.392 31.006a7.471 7.471 0 0 1-.894-5.023c.06.036.162.099.237.141l7.964 4.6a1.297 1.297 0 0 0 1.308 0l9.724-5.614v3.888a.12.12 0 0 1-.048.103l-8.051 4.649a7.504 7.504 0 0 1-10.24-2.744zM4.297 13.62A7.469 7.469 0 0 1 8.2 10.333c0 .068-.004.19-.004.274v9.201a1.294 1.294 0 0 0 .654 1.132l9.723 5.614-3.366 1.944a.12.12 0 0 1-.114.01L7.04 23.856a7.504 7.504 0 0 1-2.743-10.237zm27.658 6.437l-9.724-5.615 3.367-1.943a.121.121 0 0 1 .113-.01l8.052 4.648a7.498 7.498 0 0 1-1.158 13.528v-9.476a1.293 1.293 0 0 0-.65-1.132zm3.35-5.043c-.059-.037-.162-.099-.236-.141l-7.965-4.6a1.298 1.298 0 0 0-1.308 0l-9.723 5.614v-3.888a.12.12 0 0 1 .048-.103l8.05-4.645a7.497 7.497 0 0 1 11.135 7.763zm-21.063 6.929l-3.367-1.944a.12.12 0 0 1-.065-.092v-9.299a7.497 7.497 0 0 1 12.293-5.756 6.94 6.94 0 0 0-.236.134l-7.965 4.6a1.294 1.294 0 0 0-.654 1.132l-.006 11.225zm1.829-3.943l4.33-2.501 4.332 2.5v5l-4.331 2.5-4.331-2.5V18z"
        fill="currentColor"
      />
    </svg>
  );
};

const PerplexitySVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      imageRendering="optimizeQuality"
      fillRule="evenodd"
      clipRule="evenodd"
      viewBox="0 0 512 509.64"
    >
      <path
        fill="#1F1F1F"
        d="M115.613 0h280.774C459.974 0 512 52.025 512 115.612v278.415c0 63.587-52.026 115.613-115.613 115.613H115.613C52.026 509.64 0 457.614 0 394.027V115.612C0 52.025 52.026 0 115.613 0z"
      />
      <path
        fill="#fff"
        fillRule="nonzero"
        d="M348.851 128.063l-68.946 58.302h68.946v-58.302zm-83.908 48.709l100.931-85.349v94.942h32.244v143.421h-38.731v90.004l-94.442-86.662v83.946h-17.023v-83.906l-96.596 86.246v-89.628h-37.445V186.365h38.732V90.768l95.309 84.958v-83.16h17.023l-.002 84.206zm-29.209 26.616c-34.955.02-69.893 0-104.83 0v109.375h20.415v-27.121l84.415-82.254zm41.445 0l82.208 82.324v27.051h21.708V203.388c-34.617 0-69.274.02-103.916 0zm-42.874-17.023l-64.669-57.646v57.646h64.669zm13.617 124.076v-95.2l-79.573 77.516v88.731l79.573-71.047zm17.252-95.022v94.863l77.19 70.83c0-29.485-.012-58.943-.012-88.425l-77.178-77.268z"
      />
    </svg>
  );
};

const ClaudeSVG = () => {
  return (
    <svg
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      width="250.000000pt"
      height="250.000000pt"
      viewBox="0 0 250.000000 250.000000"
      preserveAspectRatio="xMidYMid meet"
    >
      <metadata>
        Created by potrace 1.16, written by Peter Selinger 2001-2019
      </metadata>
      <g
        transform="translate(0.000000,250.000000) scale(0.100000,-0.100000)"
        fill="#000000"
        stroke="none"
      >
        <path
          d="M916 1802 c-5 -8 -358 -953 -402 -1074 l-13 -38 117 0 118 0 40 113
 40 112 221 3 221 2 42 -115 42 -115 115 0 c114 0 115 0 109 23 -3 12 -95 263
 -205 557 l-199 535 -120 3 c-66 1 -123 -1 -126 -6z m194 -472 c35 -96 65 -181
 68 -187 3 -10 -28 -13 -137 -13 -78 0 -141 3 -141 7 0 20 136 381 141 375 3
 -4 35 -86 69 -182z"
        />
        <path
          d="M1560 1253 l207 -558 116 -3 117 -3 -27 73 c-15 40 -108 291 -208
 558 l-180 485 -116 3 -116 3 207 -558z"
        />
      </g>
    </svg>
  );
};

const Modal = ({
  modalOpen,
  onModalClose,
  children,
}: {
  modalOpen: boolean;
  onModalClose: () => void;
  children: React.ReactNode;
}) => {
  const closeModal = () => {
    onModalClose();
  };
  return (
    <AnimatePresence>
      {modalOpen && (
        <motion.div
          key="modal"
          className={`fixed inset-0 bg-black/50 flex items-center justify-center z-[10000000000000]`}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={closeModal}
        >
          <div
            className="bg-background shadow-lg rounded-lg p-4 relative w-full max-w-md border"
            onClick={(e) => e.stopPropagation()}
          >
            {children}
            <Button
              onClick={closeModal}
              size="icon"
              className="absolute top-4 right-4"
              variant={"ghost"}
            >
              <X />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
