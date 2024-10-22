import React, { useEffect, useRef, useState } from "react";
import "./App.module.css";
import "../../assets/main.css";
import { browser } from "wxt/browser";
import ExtMessage, { MessageType } from "@/entrypoints/types.ts";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/components/theme-provider.tsx";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  ChevronRightSquare,
  Flame,
  Lightbulb,
  LightbulbOff,
  Lock,
  LockOpen,
  Menu,
  Settings,
  SidebarIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Draggable from "react-draggable";
import AIToolTip from "./AIToolTip";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [locked, setLocked] = useState(false);
  const [direction, setDirection] = useState<"up" | "down" | "left" | "right">(
    "up"
  );
  const { i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  async function initI18n() {
    let data = await browser.storage.local.get("i18n");
    if (data.i18n) {
      await i18n.changeLanguage(data.i18n);
    }
  }

  async function initTooltip() {
    let data = await browser.storage.local.get("tooltip");
    if (data.tooltip) {
      setEnabled(data.tooltip);
    }
  }
  async function initLocked() {
    let data = await browser.storage.local.get("locked");
    if (data.locked) {
      setLocked(data.locked);
    }
  }
  async function initDirection() {
    let data = await browser.storage.local.get("direction");
    if (data.direction) {
      setDirection(data.direction);
    }
  }

  async function toggleTooltip() {
    setEnabled(!enabled);
    await browser.storage.local.set({ tooltip: !enabled });
    browser.runtime.sendMessage({
      messageType: MessageType.toggleTooltip,
      content: !enabled,
    });
  }
  async function toggleLocked() {
    setLocked(!locked);
    await browser.storage.local.set({ locked: !locked });
    browser.runtime.sendMessage({
      messageType: MessageType.toggleLocked,
      content: !locked,
    });
  }
  async function toggleDirection() {
    const directions = ["up", "down", "left", "right"];
    const currentIndex = directions.indexOf(direction);
    const nextIndex = (currentIndex + 1) % directions.length;
    const nextDirection = directions[nextIndex];
    setDirection(nextDirection as "up" | "down" | "left" | "right");
    await browser.storage.local.set({ direction: nextDirection });
    browser.runtime.sendMessage({
      messageType: MessageType.changeDirection,
      content: nextDirection,
    });
  }

  function domLoaded() {
    console.log("dom loaded");
  }

  async function handleOpenSidePanel() {
    const response = await browser.runtime.sendMessage({
      messageType: MessageType.toggleSidePanel,
    });
  }

  useEffect(() => {
    if (document.readyState === "complete") {
      console.log("dom complete");
      domLoaded();
    } else {
      window.addEventListener("load", () => {
        console.log("content load:");
        console.log(window.location.href);
        domLoaded();
      });
    }

    browser.runtime.onMessage.addListener(
      (message: ExtMessage, sender, sendResponse) => {
        console.log("content:");
        console.log(message);
        if (message.messageType == MessageType.clickExtIcon) {
          // setShowContent(true);
        } else if (message.messageType == MessageType.changeLocale) {
          i18n.changeLanguage(message.content);
        } else if (message.messageType == MessageType.changeTheme) {
          toggleTheme(message.content);
        }
      }
    );

    initI18n();
    initTooltip();
    initLocked();
  }, []);

  const getToolBarClass = () => {
    switch (direction) {
      case "up":
        return {
          container: "flex flex-col bottom-4 right-4",
          children: "flex flex-col",
          rotate: "-rotate-90",
        };
      case "down":
        return {
          container: "flex flex-col top-4 right-4",
          children: "flex flex-col-reverse",
          rotate: "rotate-90",
        };
      case "left":
        return {
          container: "flex flex-row-reverse right-4 bottom-4",
          children: "flex flex-row",
          rotate: "rotate-180",
        };
      case "right":
        return {
          container: "flex flex-row-reverse left-4 bottom-4",
          children: "flex flex-row-reverse",
          rotate: "rotate-0",
        };
      default:
        return {
          container: "flex flex-col bottom-4 right-4",
          children: "flex flex-col",
        };
    }
  };

  const toolBarClass = getToolBarClass();

  const side = direction === "up" || direction === "down" ? "right" : "top";

  return (
    <div className={theme}>
      <AIToolTip enabled={enabled} />
      <Draggable onStop={(e, data) => console.log(data)}>
        <div
          className={cn(
            "fixed z-[10000000000000] bg-background border rounded-full hover:opacity-100 px-1 py-1 hover:px-3 hover:py-3 shadow hover:shadow-2xl",
            toolBarClass.container
          )}
          onMouseEnter={() => setMenuOpen(true)}
          onMouseLeave={() => setMenuOpen(false)}
          style={{ transition: "opacity 0.3s, padding 0.3s, box-shadow 0.3s" }}
        >
          {(direction === "down" || direction === "left") && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="hover:scale-150 text-muted-foreground transition-all hover:bg-transparent"
                  variant="ghost"
                  size="icon"
                >
                  <Menu />
                </Button>
              </TooltipTrigger>
              <TooltipContent side={side}>Menu</TooltipContent>
            </Tooltip>
          )}
          <AnimatePresence>
            {(locked || menuOpen) && (
              <motion.div
                initial={{ opacity: 0, height: 0, width: 0 }}
                animate={{ opacity: 1, height: "auto", width: "auto" }}
                exit={{ opacity: 0, height: 0, width: 0 }}
                transition={{ duration: 0.3 }}
                className={cn("flex flex-col gap-2", toolBarClass.children)}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="hover:scale-150 text-muted-foreground transition-all hover:bg-transparent"
                      size="icon"
                      variant="ghost"
                      onClick={() => toggleLocked()}
                    >
                      {locked ? <Lock /> : <LockOpen />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side={side}>Toggle Toolbar Expansion</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="hover:scale-150 text-muted-foreground transition-all hover:bg-transparent"
                      size="icon"
                      variant="ghost"
                      onClick={() => toggleTooltip()}
                    >
                      {enabled ? <Lightbulb /> : <LightbulbOff />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side={side}>Toggle Tooltip Helper</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="hover:scale-150 text-muted-foreground transition-all hover:bg-transparent"
                      onClick={handleOpenSidePanel}
                      size={"icon"}
                      variant="ghost"
                    >
                      <SidebarIcon />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side={side}>Side Panel</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="hover:scale-150 text-muted-foreground transition-all hover:bg-transparent"
                      onClick={() => setModalOpen(true)}
                      variant="ghost"
                      size={"icon"}
                    >
                      <AlertCircle />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side={side}>Info</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="hover:scale-150 text-muted-foreground transition-all hover:bg-transparent"
                      onClick={() => setSettingsOpen(true)}
                      variant="ghost"
                      size={"icon"}
                    >
                      <Settings />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side={side}>Settings</TooltipContent>
                </Tooltip>
              </motion.div>
            )}
          </AnimatePresence>
          {(direction === "up" || direction === "right") && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="hover:scale-150 text-muted-foreground transition-all hover:bg-transparent"
                  variant="ghost"
                  size="icon"
                >
                  <Menu />
                </Button>
              </TooltipTrigger>
              <TooltipContent side={side}>Menu</TooltipContent>
            </Tooltip>
          )}
        </div>
      </Draggable>
      <Modal modalOpen={modalOpen} setModalOpen={setModalOpen} />
      <SettingsSheet
        direction={direction}
        toggleDirection={toggleDirection}
        locked={locked}
        toggleLocked={toggleLocked}
        enabled={enabled}
        toggleTooltip={toggleTooltip}
        settingsOpen={settingsOpen}
        setSettingsOpen={setSettingsOpen}
      />
    </div>
  );
};

const Modal = ({
  modalOpen,
  setModalOpen,
}: {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
}) => {
  const closeModal = () => setModalOpen(false);
  const { t } = useTranslation();

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
            className="bg-background rounded-lg p-4 flex justify-center items-center flex-col min-h-[200px] min-w-[200px] gap-2 max-w-lg max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="text-xl font-semibold text-foreground">{t("about")}</h1>
            <div className="text-center space-y-2 p-4">
              <p className="text-lg font-bold text-foreground">
                Glimmer | Your Browser Productivity Companion
              </p>
              <p className="text-sm text-muted-foreground">
                Zap is a browser extension that supercharges your productivity
                by providing you with a suite of tools to help you focus, stay
                organized, and get things done.
              </p>
              <a
                href="mailto:ym911216@gmail.com"
                className="text-primary underline"
              >
                Contact Me
              </a>
            </div>
            <Button onClick={closeModal} size="sm" className="mt-auto">
              Close
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const SettingsSheet = ({
  direction,
  toggleDirection,
  locked,
  toggleLocked,
  enabled,
  toggleTooltip,
  settingsOpen,
  setSettingsOpen,
}: {
  direction: "up" | "down" | "left" | "right";
  toggleDirection: () => void;
  locked: boolean;
  toggleLocked: () => void;
  enabled: boolean;
  toggleTooltip: () => void;
  settingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
}) => {
  const closeSheet = () => setSettingsOpen(false);
  const { t } = useTranslation();

  const rotate = {
    up: "-rotate-90",
    down: "rotate-90",
    left: "rotate-180",
    right: "rotate-0",
  };

  return (
    <AnimatePresence>
      {settingsOpen && (
        <motion.div
          key="sheet-backdrop"
          className="fixed inset-0 bg-black/50 flex justify-end z-[10000000000000]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={closeSheet}
        >
          <motion.div
            key="sheet"
            className="h-full w-[400px] bg-background p-4 flex flex-col gap-2"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            onClick={(e) => e.stopPropagation()}
            transition={{ ease: "easeInOut" }}
          >
            <h1 className="text-xl font-semibold text-foreground">{t("settings")}</h1>
            <div className="space-y-8">
              <div className="flex flex-col">
                <Label className="text-foreground">Expand Direction of Toolbar</Label>
                <Button
                  className="hover:scale-150 text-muted-foreground transition-all hover:bg-transparent"
                  size="icon"
                  variant="ghost"
                  onClick={() => toggleDirection()}
                >
                  <ChevronRightSquare className={rotate[direction]} />
                </Button>
                <p className="text-sm text-muted-foreground">
                  The direction of the toolbar is currently set to{" "}
                  <span className="font-semibold">{direction}</span>. Click to
                  change.
                </p>
              </div>
              <div className="flex flex-col">
                <Label className="text-foreground">Toggle Toolbar Expansion</Label>
                <Button
                  className="hover:scale-150 text-muted-foreground transition-all hover:bg-transparent"
                  size="icon"
                  variant="ghost"
                  onClick={() => toggleLocked()}
                >
                  {locked ? <Lock /> : <LockOpen />}
                </Button>
                <p className="text-sm text-muted-foreground">
                  The toolbar is currently{" "}
                  <span className="font-semibold">
                    {locked ? "locked" : "unlocked"}
                  </span>
                  . Click to {locked ? "unlock" : "lock"}.
                </p>
                <p className="text-sm text-muted-foreground">
                  When locked, the toolbar will remain expanded at all times.
                </p>
              </div>
              <div className="flex flex-col">
                <Label className="text-foreground">Toggle Tooltip Helper</Label>
                <Button
                  className="hover:scale-150 text-muted-foreground transition-all hover:bg-transparent"
                  size="icon"
                  variant="ghost"
                  onClick={() => toggleTooltip()}
                >
                  {enabled ? <Lightbulb /> : <LightbulbOff />}
                </Button>
                <p className="text-sm text-muted-foreground">
                  The tooltip is currently{" "}
                  <span className="font-semibold">
                    {enabled ? "enabled" : "disabled"}
                  </span>
                  . Click to {enabled ? "disable" : "enable"}.
                </p>
              </div>
            </div>
            <Button onClick={closeSheet}>Close</Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
