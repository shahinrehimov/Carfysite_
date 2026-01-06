export function generateServiceUrl(services) {
  const baseUrl = "/services/load";

  if (!services || !services.length) {
    return baseUrl;
  }

  const queryParams = services
    .map((service, index) => {
      const params = [];

      if (service.key) {
        params.push(
          `services[${index}][key]=${encodeURIComponent(service.key)}`
        );
      }

      if (service.limit !== undefined && service.limit !== null) {
        params.push(
          `services[${index}][limit]=${encodeURIComponent(service.limit)}`
        );
      }

      return params.join("&");
    })
    .filter(Boolean)
    .join("&");

  return queryParams ? `${baseUrl}?${queryParams}` : baseUrl;
}
