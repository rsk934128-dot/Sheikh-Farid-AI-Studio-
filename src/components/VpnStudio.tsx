import React, { useState, useRef, useEffect } from 'react';
import {
  Terminal,
  Shield,
  Copy,
  Check,
  Download,
  AlertTriangle,
  Server,
  Key,
  Smartphone,
  ExternalLink,
  Cpu,
  Layers,
  Play,
  RotateCcw,
  CheckCircle2,
  Lock,
  Globe,
  Radio,
  QrCode,
} from 'lucide-react';

export const VpnStudio: React.FC = () => {
  const [activeProtocol, setActiveProtocol] = useState<'3xui' | 'openvpn' | 'v2ray' | 'wireguard'>('3xui');
  const [generatedUuid, setGeneratedUuid] = useState<string>('a1b2c3d4-e5f6-47a8-b9c0-123456789abc');
  const [serverIp, setServerIp] = useState<string>('123.45.67.89');
  const [clientName, setClientName] = useState<string>('client-sheikh-farid');
  const [vpnPort, setVpnPort] = useState<string>('1194');
  const [vpnProto, setVpnProto] = useState<'udp' | 'tcp'>('udp');
  const [dnsServer, setDnsServer] = useState<string>('8.8.8.8');
  const [panelPort, setPanelPort] = useState<string>('2053');
  const [inboundProto, setInboundProto] = useState<'vmess' | 'vless' | 'trojan'>('vmess');
  const [wsPath, setWsPath] = useState<string>('/ray');
  const [inboundPort, setInboundPort] = useState<string>('443');
  const [copied, setCopied] = useState<boolean>(false);
  const [terminalSimRunning, setTerminalSimRunning] = useState<boolean>(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    '# 3X-UI অটোমেশন টেস্ট করতে "সিমুলেট রান" বাটনে ক্লিক করুন।',
  ]);

  const simTimerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (simTimerRef.current) {
        clearInterval(simTimerRef.current);
        simTimerRef.current = null;
      }
    };
  }, []);

  const generateRandomUuid = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    const newUuid = `${s4()}${s4()}-${s4()}-4${s4().substr(0, 3)}-${s4()}-${s4()}${s4()}${s4()}`;
    setGeneratedUuid(newUuid);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Run terminal simulation of 3X-UI or OpenVPN
  const runTerminalSimulation = () => {
    if (simTimerRef.current) {
      clearInterval(simTimerRef.current);
      simTimerRef.current = null;
    }
    setTerminalSimRunning(true);

    if (activeProtocol === '3xui') {
      setTerminalOutput(['$ bash <(curl -Ls https://raw.githubusercontent.com/mhsanaei/3x-ui/master/install.sh)']);
      const steps = [
        'Checking system OS: Ubuntu 22.04 LTS (x86_64)... [OK]',
        'Installing prerequisites: curl, wget, tar, socat, iptables...',
        'Fetching latest 3X-UI release from github.com/mhsanaei/3x-ui...',
        'Unpacking 3x-ui-linux-amd64.tar.gz to /usr/local/x-ui/...',
        'Configuring SQLite database: /etc/x-ui/x-ui.db...',
        'Creating systemd service: /etc/systemd/system/x-ui.service...',
        'Setting Admin Web Panel credentials:',
        '  > Default Username: admin',
        '  > Default Password: admin',
        `  > Web Panel Port: ${panelPort}`,
        'Starting x-ui service... [systemctl start x-ui.service]',
        'Enabling x-ui on system boot... [OK]',
        '',
        '----------------------------------------------------------',
        '✓ SUCCESS: 3X-UI (v2.4.x) Installed Successfully!',
        `✓ Web Management URL: http://${serverIp}:${panelPort}`,
        '✓ Xray Core Status: RUNNING',
        '----------------------------------------------------------',
        'You can now login to the Web UI, click "Inbounds" -> "Add Inbound", and distribute client QR links.',
      ];

      let current = 0;
      simTimerRef.current = setInterval(() => {
        if (current < steps.length) {
          const nextLine = steps[current];
          if (typeof nextLine === 'string') {
            setTerminalOutput((prev) => [...prev, nextLine]);
          }
          current++;
        } else {
          if (simTimerRef.current) {
            clearInterval(simTimerRef.current);
            simTimerRef.current = null;
          }
          setTerminalSimRunning(false);
        }
      }, 140);
    } else if (activeProtocol === 'wireguard') {
      setTerminalOutput(['$ wget https://git.io/wireguard -O wireguard-install.sh && bash wireguard-install.sh']);
      const steps = [
        'Checking Linux Kernel WireGuard module... [OK: Kernel 5.15+ Built-in]',
        'Installing wireguard-tools, qrencode, iptables...',
        `Public IPv4 detected: ${serverIp}`,
        'WireGuard interface: wg0',
        'Server private key generated (Curve25519)...',
        'Server public key: xZ9k7qLpM...= [OK]',
        'Server port selected: 51820 (UDP)',
        'Internal IPv4 subnet: 10.66.66.1/24',
        'DNS Resolver selected: 1.1.1.1, 8.8.8.8',
        `Generating client configuration for "${clientName}"...`,
        'Client private key generated...',
        'Client assigned IP: 10.66.66.2/32',
        'Starting WireGuard service: [systemctl start wg-quick@wg0] [OK]',
        'Enabling wg-quick@wg0 at system boot [OK]',
        `✓ SUCCESS: Client configuration written to: /root/${clientName}.conf`,
        '✓ QR Code generated in terminal for immediate mobile scan in WireGuard app!',
      ];

      let current = 0;
      simTimerRef.current = setInterval(() => {
        if (current < steps.length) {
          const nextLine = steps[current];
          if (typeof nextLine === 'string') {
            setTerminalOutput((prev) => [...prev, nextLine]);
          }
          current++;
        } else {
          if (simTimerRef.current) {
            clearInterval(simTimerRef.current);
            simTimerRef.current = null;
          }
          setTerminalSimRunning(false);
        }
      }, 140);
    } else {
      setTerminalOutput(['$ wget https://git.io/vpn -O openvpn-install.sh && bash openvpn-install.sh']);
      const steps = [
        'Resolving git.io... 140.82.112.4',
        'Saving to: ‘openvpn-install.sh’ - 100%',
        'Welcome to OpenVPN Road Warrior installer!',
        `Detecting public IPv4 address... ${serverIp}`,
        `Protocol selected: ${vpnProto.toUpperCase()}`,
        `Port selected: ${vpnPort}`,
        `DNS Resolver: ${dnsServer}`,
        'Installing openvpn, iptables, openssl...',
        'Generating DH parameters, 2048 bit safe prime...',
        'Generating CA certificate and private key...',
        `Generating client certificate for "${clientName}"...`,
        'Starting OpenVPN service: [systemctl start openvpn-server@server] [OK]',
        `✓ SUCCESS: Client profile generated: /root/${clientName}.ovpn`,
      ];

      let current = 0;
      simTimerRef.current = setInterval(() => {
        if (current < steps.length) {
          const nextLine = steps[current];
          if (typeof nextLine === 'string') {
            setTerminalOutput((prev) => [...prev, nextLine]);
          }
          current++;
        } else {
          if (simTimerRef.current) {
            clearInterval(simTimerRef.current);
            simTimerRef.current = null;
          }
          setTerminalSimRunning(false);
        }
      }, 140);
    }
  };

  // Generate 3X-UI VMess / VLess connection URI
  const generateVmessLink = (): string => {
    if (inboundProto === 'vless') {
      return `vless://${generatedUuid}@${serverIp}:${inboundPort}?type=ws&security=none&path=${encodeURIComponent(wsPath)}#Sheikh-Farid-3X-UI-VLess`;
    }

    const vmessObj = {
      v: '2',
      ps: 'Sheikh-Farid-3X-UI-VMess',
      add: serverIp,
      port: inboundPort,
      id: generatedUuid,
      aid: '0',
      scy: 'auto',
      net: 'ws',
      type: 'none',
      host: '',
      path: wsPath,
      tls: 'none',
      sni: '',
      alpn: '',
    };
    return 'vmess://' + btoa(JSON.stringify(vmessObj));
  };

  // Generate complete .ovpn client configuration
  const generateOvpnConfig = (): string => {
    return `client
dev tun
proto ${vpnProto}
remote ${serverIp} ${vpnPort}
resolv-retry infinite
nobind
persist-key
persist-tun
remote-cert-tls server
auth SHA256
cipher AES-128-GCM
ignore-unknown-option block-outside-dns
block-outside-dns
verb 3
dhcp-option DNS ${dnsServer}

<ca>
-----BEGIN CERTIFICATE-----
MIIB/zCCAaWgAwIBAgIUW9Z0...[SHEIKH-FARID-STUDIO-ROOT-CA]...
-----END CERTIFICATE-----
</ca>
<cert>
-----BEGIN CERTIFICATE-----
MIICBjCCAe2gAwIBAgIRAP...[CLIENT-CERTIFICATE-${clientName.toUpperCase()}]...
-----END CERTIFICATE-----
</cert>
<key>
-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC6...[ENCRYPTED-RSA-KEY]...
-----END PRIVATE KEY-----
</key>
<tls-crypt>
-----BEGIN OpenVPN Static key V1-----
a1b2c3d4e5f60718293a4b5c6d7e8f90...[STATIC-TLS-CRYPT-KEY]...
-----END OpenVPN Static key V1-----
</tls-crypt>`;
  };

  const downloadOvpnFile = () => {
    const content = generateOvpnConfig();
    const blob = new Blob([content], { type: 'application/x-openvpn-profile' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${clientName}.ovpn`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadV2rayJsonFile = () => {
    const blob = new Blob([v2rayConfigJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateWireGuardConfig = (): string => {
    return `[Interface]
PrivateKey = yAn7G9zK...[CLIENT-CURVE25519-KEY]...=
Address = 10.66.66.2/32
DNS = ${dnsServer}

[Peer]
PublicKey = xZ9k7qLpM...[SERVER-PUBLIC-KEY]...=
Endpoint = ${serverIp}:51820
AllowedIPs = 0.0.0.0/0, ::/0
PersistentKeepalive = 25`;
  };

  const downloadWireGuardConf = () => {
    const content = generateWireGuardConfig();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${clientName}.conf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // V2Ray Config JSON
  const v2rayConfigJson = JSON.stringify(
    {
      inbounds: [
        {
          port: 443,
          protocol: 'vmess',
          settings: {
            clients: [
              {
                id: generatedUuid,
                alterId: 0,
              },
            ],
          },
          streamSettings: {
            network: 'ws',
            wsSettings: {
              path: '/ray',
            },
          },
        },
      ],
      outbounds: [
        {
          protocol: 'freedom',
          settings: {},
        },
      ],
    },
    null,
    2
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* Title & Warning Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Terminal className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              ভিপিএন ও প্রক্সি সার্ভার আর্কিটেকচার স্টুডিও (NetSec Lab)
            </h2>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            ব্যক্তিগত রিমোট এক্সেস সার্ভার, 3X-UI মাল্টি-ইউজার ওয়েব প্যানেল, V2Ray এবং OpenVPN কনফিগারেশন হাব।
          </p>
        </div>

        {/* Protocol Selector */}
        <div className="flex rounded-xl border border-slate-800 bg-slate-900 p-1">
          {[
            { id: '3xui', label: '3X-UI ওয়েব প্যানেল' },
            { id: 'openvpn', label: 'OpenVPN রোড ওয়ারিয়র' },
            { id: 'v2ray', label: 'V2Ray VMess' },
            { id: 'wireguard', label: 'WireGuard' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveProtocol(tab.id as any);
                setTerminalOutput([
                  `# ${tab.label} টেস্ট করতে "সিমুলেট রান" বা "কমান্ড কপি" বাটনে ক্লিক করুন।`,
                ]);
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                activeProtocol === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cyber Security Warning Banner */}
      <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 text-xs text-amber-200">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-amber-300">
              3X-UI সার্ভার সেটআপ নির্দেশিকা (VPS Cloud Guide):
            </span>
            <p className="text-amber-200/90 leading-relaxed">
              আপনার কেনা লিনাক্স VPS সার্ভারে (Ubuntu 22.04 LTS) SSH দিয়ে লগইন করুন এবং কমান্ডটি পেস্ট করুন। ইনস্টল শেষে ব্রাউজারে <code className="bg-slate-900 px-1 py-0.5 rounded text-cyan-300 font-mono">http://{serverIp}:{panelPort}</code> দিয়ে অ্যাডমিন ড্যাশবোর্ডে লগইন করে মাউসের ক্লিকেই নতুন ইউজার, কিউআর কোড ও ডেটা লিমিট সেট করা যাবে।
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Script / Config Display & Terminal Simulator */}
        <div className="space-y-4 lg:col-span-7">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white">
                  {activeProtocol === '3xui'
                    ? '3X-UI এক ক্লিকে ইনস্টলেশন স্ক্রিপ্ট (mhsanaei/3x-ui)'
                    : activeProtocol === 'openvpn'
                    ? 'OpenVPN Road Warrior অটোমেশন স্ক্রিপ্ট'
                    : activeProtocol === 'v2ray'
                    ? 'V2Ray কোর ও config.json স্ক্রিপ্ট'
                    : 'WireGuard ফাস্ট টানেল স্ক্রিপ্ট'}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {(activeProtocol === '3xui' || activeProtocol === 'openvpn') && (
                  <button
                    onClick={runTerminalSimulation}
                    disabled={terminalSimRunning}
                    className="flex items-center gap-1 rounded-md bg-emerald-600 hover:bg-emerald-500 px-2.5 py-1 text-xs font-bold text-white transition-colors disabled:opacity-50"
                  >
                    <Play className="h-3 w-3 fill-white" />
                    <span>সিমুলেট রান</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    let script = '';
                    if (activeProtocol === '3xui') {
                      script = 'bash <(curl -Ls https://raw.githubusercontent.com/mhsanaei/3x-ui/master/install.sh)';
                    } else if (activeProtocol === 'openvpn') {
                      script = 'wget https://git.io/vpn -O openvpn-install.sh && bash openvpn-install.sh';
                    } else if (activeProtocol === 'v2ray') {
                      script = v2rayConfigJson;
                    } else {
                      script = 'wget https://git.io/wireguard -O wireguard-install.sh && bash wireguard-install.sh';
                    }
                    copyToClipboard(script);
                  }}
                  className="flex items-center gap-1 rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'কপি হয়েছে' : 'কমান্ড কপি'}</span>
                </button>
              </div>
            </div>

            {/* Script Display */}
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-200 overflow-x-auto">
              {activeProtocol === '3xui' && (
                <div className="space-y-3">
                  <div className="text-slate-400"># আপনার উবুন্টু VPS সার্ভারে পেস্ট করুন:</div>
                  <div className="text-emerald-400 bg-slate-900 p-2.5 rounded border border-slate-800 flex items-center justify-between">
                    <span className="select-all">bash &lt;(curl -Ls https://raw.githubusercontent.com/mhsanaei/3x-ui/master/install.sh)</span>
                  </div>
                  <div className="text-slate-400 text-[11px] leading-relaxed">
                    💡 <strong>3X-UI প্যানেলের সুবিধা:</strong> কোনো ম্যানুয়াল কোড ছাড়াই ব্রাউজারে ড্যাশবোর্ড ওপেন হবে। সেখান থেকে আনলিমিটেড গ্রাহক অ্যাকাউন্ট, ডেটা সীমা (GB limit) এবং এক্সপায়ারি ডেট সেট করতে পারবেন।
                  </div>
                </div>
              )}

              {activeProtocol === 'openvpn' && (
                <div className="space-y-3">
                  <div className="text-slate-400"># OpenVPN Road Warrior ইনস্টল কমান্ড:</div>
                  <div className="text-emerald-400 bg-slate-900 p-2.5 rounded border border-slate-800">
                    wget https://git.io/vpn -O openvpn-install.sh && bash openvpn-install.sh
                  </div>
                </div>
              )}

              {activeProtocol === 'v2ray' && (
                <div className="space-y-3">
                  <div className="text-slate-400"># ১. সার্ভারে V2Ray ইনস্টল কমান্ড:</div>
                  <div className="text-emerald-400 bg-slate-900 p-2 rounded">
                    bash &lt;(curl -Ls https://raw.githubusercontent.com/v2fly/fhs-install-v2ray/master/install-release.sh)
                  </div>
                  <div className="text-slate-400"># ২. /usr/local/etc/v2ray/config.json ফাইলে সেভ করুন:</div>
                  <pre className="text-cyan-300 max-h-56 overflow-y-auto">{v2rayConfigJson}</pre>
                </div>
              )}

              {activeProtocol === 'wireguard' && (
                <div className="space-y-3">
                  <div className="text-slate-400"># আধুনিকতম আল্ট্রা-ফাস্ট WireGuard অটো স্ক্রিপ্ট:</div>
                  <div className="text-emerald-400 bg-slate-900 p-2 rounded">
                    wget https://git.io/wireguard -O wireguard-install.sh && bash wireguard-install.sh
                  </div>
                </div>
              )}
            </div>

            {/* Interactive Terminal Simulator Box */}
            <div className="mt-4 rounded-xl border border-slate-800 bg-black/90 p-4 font-mono text-[11px] text-emerald-400 shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2 text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>root@vps-server:~ (লাইভ ইনস্টলেশন টার্মিনাল সিমুলেটর)</span>
                </span>
                <button
                  onClick={() => {
                    if (simTimerRef.current) {
                      clearInterval(simTimerRef.current);
                      simTimerRef.current = null;
                    }
                    setTerminalSimRunning(false);
                    setTerminalOutput(['# টার্মিনাল রিসেট সম্পন্ন।']);
                  }}
                  className="hover:text-white"
                >
                  <RotateCcw className="h-3 w-3" />
                </button>
              </div>
              <div className="h-44 overflow-y-auto space-y-1 select-text scrollbar-thin">
                {terminalOutput
                  .filter((line): line is string => typeof line === 'string')
                  .map((line, idx) => (
                    <div
                      key={idx}
                      className={
                        line && line.startsWith('✓')
                          ? 'text-cyan-300 font-bold'
                          : line && line.startsWith('$')
                          ? 'text-yellow-400 font-bold'
                          : ''
                      }
                    >
                      {line}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive 3X-UI / Inbound & Link Generator */}
        <div className="space-y-4 lg:col-span-5">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Globe className="h-4 w-4 text-cyan-400" />
                <span>
                  {activeProtocol === '3xui'
                    ? '3X-UI ইনবাউন্ড ও ক্লায়েন্ট কানেকশন লিংক'
                    : activeProtocol === 'openvpn'
                    ? 'OpenVPN .ovpn ক্লায়েন্ট প্রোফাইল'
                    : activeProtocol === 'v2ray'
                    ? 'V2Ray config.json ও ক্লায়েন্ট VMess লিংক'
                    : activeProtocol === 'wireguard'
                    ? 'WireGuard wg0-client.conf ও QR কোড'
                    : 'ডায়নামিক UUID ও ক্লায়েন্ট প্যারামিটার'}
                </span>
              </h3>

              {activeProtocol === 'openvpn' && (
                <button
                  onClick={downloadOvpnFile}
                  className="flex items-center gap-1 rounded-md bg-emerald-600 hover:bg-emerald-500 px-2.5 py-1 text-xs font-bold text-white shadow transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>.ovpn ডাউনলোড</span>
                </button>
              )}

              {activeProtocol === 'wireguard' && (
                <button
                  onClick={downloadWireGuardConf}
                  className="flex items-center gap-1 rounded-md bg-emerald-600 hover:bg-emerald-500 px-2.5 py-1 text-xs font-bold text-white shadow transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>.conf ডাউনলোড</span>
                </button>
              )}

              {activeProtocol === 'v2ray' && (
                <button
                  onClick={downloadV2rayJsonFile}
                  className="flex items-center gap-1 rounded-md bg-cyan-600 hover:bg-cyan-500 px-2.5 py-1 text-xs font-bold text-white shadow transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>config.json ডাউনলোড</span>
                </button>
              )}
            </div>

            {activeProtocol === '3xui' ? (
              /* 3X-UI Inbound Configuration Form */
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 font-medium">সার্ভার আইপি:</label>
                    <input
                      type="text"
                      value={serverIp}
                      onChange={(e) => setServerIp(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-100 font-mono focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-medium">ওয়েব প্যানেল পোর্ট:</label>
                    <input
                      type="text"
                      value={panelPort}
                      onChange={(e) => setPanelPort(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-cyan-300 font-mono focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 font-medium">ইনবাউন্ড প্রোটোকল:</label>
                    <select
                      value={inboundProto}
                      onChange={(e) => setInboundProto(e.target.value as any)}
                      className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-100 focus:border-cyan-500 focus:outline-none"
                    >
                      <option value="vmess">VMess (V2RayNG / Shadowrocket)</option>
                      <option value="vless">VLESS (আধুনিক ও ফাস্ট)</option>
                      <option value="trojan">Trojan (HTTPS এনক্রিপশন)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 font-medium">ইনবাউন্ড পোর্ট (Traffic Port):</label>
                    <input
                      type="text"
                      value={inboundPort}
                      onChange={(e) => setInboundPort(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-100 font-mono focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-slate-400 font-medium">ইউজার UUID:</label>
                    <button
                      onClick={generateRandomUuid}
                      className="text-[11px] font-semibold text-cyan-400 hover:underline"
                    >
                      নতুন UUID
                    </button>
                  </div>
                  <input
                    type="text"
                    readOnly
                    value={generatedUuid}
                    className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-emerald-400 font-mono text-[11px] focus:outline-none"
                  />
                </div>

                {/* Generated URI Link */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <QrCode className="h-3.5 w-3.5 text-cyan-400" />
                      <span>জেনারেট হওয়া কানেকশন লিংক:</span>
                    </span>
                    <button
                      onClick={() => copyToClipboard(generateVmessLink())}
                      className="text-cyan-400 hover:underline font-bold"
                    >
                      কপি লিংক
                    </button>
                  </div>
                  <div className="break-all rounded bg-slate-900 p-2 font-mono text-[10px] text-cyan-200 selection:bg-cyan-500">
                    {generateVmessLink()}
                  </div>
                  <p className="text-[10px] text-slate-400">
                    এই লিংকটি কপি করে সরাসরি V2RayNG (Android) বা v2rayN (Windows) অ্যাপে &quot;Import config from clipboard&quot; এ পেস্ট করলেই কানেক্ট হয়ে যাবে।
                  </p>
                </div>
              </div>
            ) : activeProtocol === 'openvpn' ? (
              /* OpenVPN Config Form */
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 font-medium">সার্ভার আইপি:</label>
                  <input
                    type="text"
                    value={serverIp}
                    onChange={(e) => setServerIp(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-100 font-mono focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 font-medium">প্রোটোকল:</label>
                    <select
                      value={vpnProto}
                      onChange={(e) => setVpnProto(e.target.value as any)}
                      className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-100 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="udp">UDP (দ্রুতগতির)</option>
                      <option value="tcp">TCP (পোর্ট ৪৪৩)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 font-medium">পোর্ট:</label>
                    <input
                      type="text"
                      value={vpnPort}
                      onChange={(e) => setVpnPort(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-100 font-mono focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-2">
                  <pre className="max-h-40 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950 p-2.5 font-mono text-[10px] text-slate-300">
                    {generateOvpnConfig()}
                  </pre>
                </div>
              </div>
            ) : activeProtocol === 'v2ray' ? (
              /* Dedicated V2Ray VMess Configuration & Link Generator */
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 font-medium">সার্ভার আইপি (Server Public IP):</label>
                  <input
                    type="text"
                    value={serverIp}
                    onChange={(e) => setServerIp(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-100 font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 font-medium">পোর্ট (Inbound Port):</label>
                    <input
                      type="text"
                      value="443"
                      readOnly
                      className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-400 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-medium">নেটওয়ার্ক ও পাথ:</label>
                    <input
                      type="text"
                      value="WebSocket (/ray)"
                      readOnly
                      className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-400 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-slate-400 font-medium">ক্লায়েন্ট UUID:</label>
                    <button
                      onClick={generateRandomUuid}
                      className="text-[11px] font-semibold text-cyan-400 hover:underline"
                    >
                      নতুন UUID তৈরি
                    </button>
                  </div>
                  <input
                    type="text"
                    value={generatedUuid}
                    onChange={(e) => setGeneratedUuid(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-emerald-400 font-mono text-[11px] focus:outline-none"
                  />
                </div>

                {/* Generated Client VMess URI */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <QrCode className="h-3.5 w-3.5 text-cyan-400" />
                      <span>ক্লায়েন্ট ইমপোর্ট লিংক (VMess URI):</span>
                    </span>
                    <button
                      onClick={() => copyToClipboard(generateVmessLink())}
                      className="text-cyan-400 hover:underline font-bold"
                    >
                      কপি vmess:// লিংক
                    </button>
                  </div>
                  <div className="break-all rounded bg-slate-900 p-2 font-mono text-[10px] text-cyan-200 selection:bg-cyan-500">
                    {generateVmessLink()}
                  </div>
                  <p className="text-[10px] text-slate-400">
                    মোবাইলে <strong>V2RayNG</strong> অ্যাপে গিয়ে <code>+</code> বাটনে ক্লিক করে <em>Import config from clipboard</em> দিলে সাথে সাথে এই সার্ভার যুক্ত হবে।
                  </p>
                </div>

                {/* Server Path Instructions */}
                <div className="rounded-lg border border-slate-800/80 bg-slate-900/60 p-2.5 text-[11px] text-slate-300 space-y-1">
                  <div className="font-semibold text-slate-200">সার্ভারে কনফিগারেশন সেভ করার নিয়ম:</div>
                  <div className="text-slate-400">
                    ১. কনফিগারেশন পাথ: <code className="text-amber-300">/usr/local/etc/v2ray/config.json</code>
                  </div>
                  <div className="text-slate-400">
                    ২. সিনট্যাক্স টেস্ট: <code className="text-emerald-300">v2ray test -c /usr/local/etc/v2ray/config.json</code>
                  </div>
                  <div className="text-slate-400">
                    ৩. সার্ভিস রিস্টার্ট: <code className="text-cyan-300">systemctl restart v2ray</code>
                  </div>
                </div>
              </div>
            ) : activeProtocol === 'wireguard' ? (
              /* Dedicated WireGuard Configuration & QR Code Panel */
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 font-medium">সার্ভার আইপি (Remote VPS Endpoint):</label>
                  <input
                    type="text"
                    value={serverIp}
                    onChange={(e) => setServerIp(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-100 font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 font-medium">WireGuard পোর্ট:</label>
                    <input
                      type="text"
                      value="51820 (UDP)"
                      readOnly
                      className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-400 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-medium">ক্লায়েন্ট সাবনেট আইপি:</label>
                    <input
                      type="text"
                      value="10.66.66.2/32"
                      readOnly
                      className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-400 font-mono"
                    />
                  </div>
                </div>

                {/* Preformatted wg0-client.conf Preview */}
                <div className="mt-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span>জেনারেট হওয়া {clientName}.conf প্রিভিউ:</span>
                    <button
                      onClick={() => copyToClipboard(generateWireGuardConfig())}
                      className="text-emerald-400 hover:underline font-bold"
                    >
                      কপি .conf ফাইল
                    </button>
                  </div>
                  <pre className="max-h-40 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950 p-2.5 font-mono text-[10px] text-emerald-300">
                    {generateWireGuardConfig()}
                  </pre>
                </div>

                {/* WireGuard App Instructions */}
                <div className="rounded-lg border border-slate-800/80 bg-slate-900/60 p-2.5 text-[11px] text-slate-300 space-y-1">
                  <div className="font-semibold text-slate-200">WireGuard কানেক্ট করার নিয়ম:</div>
                  <div className="text-slate-400">
                    ১. স্ক্রিপ্টটি টার্মিনালে রান করলে সরাসরি একটি <strong>QR Code</strong> স্ক্রিনে ভেসে উঠবে।
                  </div>
                  <div className="text-slate-400">
                    ২. মোবাইলে অফিশিয়াল <strong>WireGuard</strong> অ্যাপ ওপেন করে <code>Scan from QR code</code> দিলেই মুহূর্তেই কানেক্ট হবে।
                  </div>
                  <div className="text-slate-400">
                    ৩. উইন্ডোজ/ম্যাকের জন্য উপরের <code className="text-emerald-300">{clientName}.conf</code> ফাইলটি ডাউনলোড করে ইমপোর্ট করুন।
                  </div>
                </div>
              </div>
            ) : (
              /* Other protocols */
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 font-medium">সার্ভার আইপি এড্রেস:</label>
                  <input
                    type="text"
                    value={serverIp}
                    onChange={(e) => setServerIp(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-100 font-mono focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
