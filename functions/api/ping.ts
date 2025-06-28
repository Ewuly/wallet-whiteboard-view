import { jsonResponse, reportError } from "./cfPagesFunctionsUtils"

export const onRequestGet: PagesFunction<ENV> = async (ctx) => {
  try {
    return jsonResponse({ message: "Pong!" }, 200)
  } catch (e) {
    await reportError(ctx.env.DB, e)
    return jsonResponse({ message: "Something went wrong..." }, 500)
  }
}
