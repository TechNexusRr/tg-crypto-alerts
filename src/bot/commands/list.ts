import type { Context } from "grammy";
import { findOrCreateUser } from "../../services/user-store.ts";
import { getActiveAlertsByUser } from "../../services/alert-store.ts";
import { formatAlertList } from "../formatters.ts";

export function listCommand() {
  return (ctx: Context) => {
    const chatId = ctx.chat?.id.toString() ?? "";
    const username = ctx.from?.username;
    const user = findOrCreateUser(chatId, username);

    const alertList = getActiveAlertsByUser(user.id);
    return ctx.reply(formatAlertList(alertList));
  };
}
