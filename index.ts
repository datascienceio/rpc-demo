import { ArianeeRPCCustom } from "@arianee/arianee-rpc-server";
import { NETWORK } from "@arianee/arianeejs";
import express from "express";

const store = () => {
  const m = new Map<string, string>();
  return { get: (id: string) => Promise.resolve(m.get(id) ?? ""), set: (id: string, c: string) => { m.set(id, c); return Promise.resolve(c); } };
};
const [cert, evt, msg, upd] = [store(), store(), store(), store()];

const rpc = new ArianeeRPCCustom(NETWORK.mainnet);
rpc.setCertificateContentMethods(cert.get, (id, c) => cert.set(id, c), (id, c) => cert.set(id, c));
rpc.setEventContentMethods(evt.get, (id, c) => evt.set(id, c), (id, c) => evt.set(id, c));
rpc.setMessageContentMethods(msg.get, (id, c) => msg.set(id, c), (id, c) => msg.set(id, c));
rpc.setUpdateContentMethods(upd.get, (id, c) => upd.set(id, c), (id, c) => upd.set(id, c));

const app = express();
app.use(express.json());
app.get("/", (_, res) => res.send("arianee-rpc-mini"));
app.post("/rpc", rpc.build());

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => console.log(`RPC on :${port}`));
