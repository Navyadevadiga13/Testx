const getApiBaseUrl = () => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;

    if (hostname === "testx.cc" || hostname === "www.testx.cc") {
      return "/api";
    }

    if (hostname === "168.231.103.88") {
      return "http://168.231.103.88:5008/api";
    }

    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:5008/api";
    }

    return "/api";
  }

  return "http://localhost:5008/api";
};

export default getApiBaseUrl;
