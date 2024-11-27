export default function (title: string) {
  // 兼容微信环境
  if (/MicroMessenger/i.test(navigator.userAgent)) {
    const i = document.createElement('iframe');
    i.src = '/';
    i.style.display = 'none';
    i.onload = () => {
      document.title = title;
      setTimeout(() => {
        i.remove();
      }, 0);
    };
    document.body.appendChild(i);
  } else {
    document.title = title;
  }
}
