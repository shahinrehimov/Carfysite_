"use client";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, X, Check, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { addressService } from "@/lib/addressService";
import { useTranslations } from "next-intl";
import { api } from "@/lib/axios/api";
import dynamic from "next/dynamic";
import { AccountGridLoading } from "@/components/account/account-loading";

const Map = dynamic(() => import("@/components/ui/map"), { ssr: false });

// Validation schema for address
const emptyStringToUndefined = (value, originalValue) =>
  originalValue === "" || originalValue === null ? undefined : value;

const addressSchema = yup.object().shape({
  address_type_id: yup
    .number()
    .transform(emptyStringToUndefined)
    .typeError("address_type_required")
    .required("address_type_required")
    .positive("address_type_required"),
  city_id: yup
    .number()
    .transform(emptyStringToUndefined)
    .typeError("city_required")
    .required("city_required")
    .positive("city_required"),
  address_line_1: yup
    .string()
    .required("address_line_1_required")
    .min(5, "address_line_1_min_length"),
  address_line_2: yup.string().nullable(),
  latitude: yup.string().required("latitude_required"),
  longitude: yup.string().required("longitude_required"),
  phone: yup
    .string()
    .required("phone_required")
    .matches(/^\+994\d{9}$/, "phone_format_error"),
});

export default function AddressesPage() {
  const t = useTranslations();
  const [addresses, setAddresses] = useState([]);
  const [addressTypes, setAddressTypes] = useState([]);
  const [cities, setCities] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Delete confirmation modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deletingAddress, setDeletingAddress] = useState(null);

  // Custom dropdown states
  const [isAddressTypeOpen, setIsAddressTypeOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(addressSchema),
    defaultValues: {
      address_type_id: "",
      city_id: "",
      address_line_1: "",
      address_line_2: "",
      latitude: "40.4093", // Default to Baku
      longitude: "49.8671", // Default to Baku
      phone: "",
    },
  });

  // Load initial data (address types and cities) and addresses on mount.
  // These run independently so addresses still load even if the services
  // lookup call fails or returns empty lists.
  useEffect(() => {
    loadInitialData();
    loadAddresses();
  }, []);

  // Update form defaults when addressTypes are loaded
  useEffect(() => {
    if (
      addressTypes.length > 0 &&
      !editingAddress &&
      !watch("address_type_id")
    ) {
      setValue("address_type_id", addressTypes[0].id);
    }
  }, [addressTypes, editingAddress, setValue, watch]);

  const loadInitialData = async () => {
    setIsDataLoading(true);
    try {
      // Load address types and cities from services
      const response = await api.get(
        "/services/load?services[0][key]=address_type&services[1][key]=country_and_city"
      );

      if (response.data?.data) {
        const data = response.data.data;
        setAddressTypes(data.address_type || []);
        // Get cities from the first country (Azerbaijan)
        setCities(data.country_and_city?.[0]?.cities || []);
      }
    } catch (error) {
      console.error("Error loading initial data:", error);
    } finally {
      setIsDataLoading(false);
    }
  };

  const loadAddresses = async () => {
    setIsLoading(true);
    try {
      const result = await addressService.getAddresses();
      if (result.success) {
        setAddresses(result.data.data || []);
      } else {
        console.error("Failed to load addresses:", result.error);
      }
    } catch (error) {
      console.error("Error loading addresses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Close dropdowns when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      const addressTypeDropdown = event.target.closest(
        '[data-dropdown="address-type"]'
      );
      const cityDropdown = event.target.closest('[data-dropdown="city"]');

      if (!addressTypeDropdown) {
        setIsAddressTypeOpen(false);
      }
      if (!cityDropdown) {
        setIsCityOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsAddressTypeOpen(false);
        setIsCityOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isModalOpen]);

  const openModal = (address = null) => {
    setEditingAddress(address);
    setIsAddressTypeOpen(false);
    setIsCityOpen(false);

    if (address) {
      reset({
        address_type_id: address.address_type?.id || addressTypes[0]?.id || 1,
        city_id: address.city?.id || "",
        address_line_1: address.address_line_1 || "",
        address_line_2: address.address_line_2 || "",
        latitude: address.latitude || "40.4093",
        longitude: address.longitude || "49.8671",
        phone: address.phone || "",
      });
    } else {
      reset({
        address_type_id: addressTypes[0]?.id || "",
        city_id: "",
        address_line_1: "",
        address_line_2: "",
        latitude: "40.4093",
        longitude: "49.8671",
        phone: "",
      });
    }
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      setIsModalVisible(true);
    }, 10);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setIsAddressTypeOpen(false);
    setIsCityOpen(false);
    setTimeout(() => {
      setIsModalOpen(false);
      setEditingAddress(null);
      document.body.style.overflow = "unset";
    }, 300);
  };

  const openDeleteModal = (address) => {
    setDeletingAddress(address);
    setIsDeleteModalOpen(true);
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      setIsDeleteModalVisible(true);
    }, 10);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalVisible(false);
    setTimeout(() => {
      setIsDeleteModalOpen(false);
      setDeletingAddress(null);
      document.body.style.overflow = "unset";
    }, 300);
  };

  const onSubmit = async (data) => {
    try {
      let result;
      if (editingAddress) {
        result = await addressService.updateAddress(editingAddress.id, data);
      } else {
        result = await addressService.addAddress(data);
      }

      if (result.success) {
        await loadAddresses();
        closeModal();
      } else {
        console.error("Address save error:", result.error);
        alert(result.error || t("address_save_failed"));
      }
    } catch (error) {
      console.error("Address save error:", error);
      alert(t("address_save_error"));
    }
  };

  const setPrimaryAddress = async (addressId) => {
    try {
      const result = await addressService.setDefaultAddress(addressId);
      if (result.success) {
        await loadAddresses();
      } else {
        console.error("Set default address error:", result.error);
        alert(result.error || t("address_set_default_failed"));
      }
    } catch (error) {
      console.error("Set default address error:", error);
      alert(t("address_set_default_error"));
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      const result = await addressService.deleteAddress(addressId);
      if (result.success) {
        await loadAddresses();
        closeDeleteModal();
      } else {
        console.error("Delete address error:", result.error);
        alert(result.error || t("address_delete_failed"));
      }
    } catch (error) {
      console.error("Delete address error:", error);
      alert(t("address_delete_error"));
    }
  };

  if (isDataLoading) {
    return <AccountGridLoading count={6} showTitle />;
  }

  return (
    <>
      <div className="w-full  ">
        <div className="w-full mb-6 hidden lg:block">
          <h2 className="text-xl lg:text-2xl font-semibold text-gray-900">
            {t("address")}
          </h2>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <AccountGridLoading count={6} />
        ) : (
          <>
            {/* Address List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="relative border border-gray-200 rounded-xl p-4 bg-white hover:shadow-md transition-shadow"
                >
                  {/* Primary Checkbox and Delete Button */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => openDeleteModal(address)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setPrimaryAddress(address.id)}
                      className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer",
                        address.is_default
                          ? "bg-[#00569C] border-[#00569C] text-white"
                          : "border-gray-300 hover:border-[#00569C]"
                      )}
                    >
                      {address.is_default && <Check className="w-3 h-3" />}
                    </button>
                  </div>

                  <div className="pr-16">
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {address.address_type?.title || t("address")}
                      </h3>
                    </div>

                    <div className="text-gray-600 space-y-3 border-b border-gray-200 pb-4 mb-3">
                      <div>
                        <span className="text-sm text-gray-500">
                          {t("city")}:
                        </span>
                        <div className="font-medium text-gray-900">
                          {address.city?.title || t("not_available")}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">
                          {t("address_line_1")}:
                        </span>
                        <div className="font-medium text-gray-900">
                          {address.address_line_1}
                        </div>
                      </div>
                      {address.address_line_2 && (
                        <div>
                          <span className="text-sm text-gray-500">
                            {t("address_line_2")}:
                          </span>
                          <div className="font-medium text-gray-900">
                            {address.address_line_2}
                          </div>
                        </div>
                      )}
                      <div>
                        <span className="text-sm text-gray-500">
                          {t("phone")}:
                        </span>
                        <div className="font-medium text-gray-900">
                          {address.phone}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => openModal(address)}
                      className="text-[#00569C] hover:text-[#004580] text-sm font-medium cursor-pointer transition-colors"
                    >
                      {t("edit_address")}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {addresses.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">{t("no_addresses_found")}</p>
              </div>
            )}
          </>
        )}

        {/* Add Address Button */}
        <Button
          onClick={() => openModal()}
          variant="primary"
          size="lg"
          className="w-full max-w-md cursor-pointer"
        >
          {t("add_address")}
        </Button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className={cn(
              "absolute inset-0 bg-black/50 transition-opacity duration-300 ease-out",
              isModalVisible ? "opacity-100" : "opacity-0"
            )}
            onClick={closeModal}
          />

          {/* Modal Content */}
          <div
            className={cn(
              "relative bg-white rounded-2xl w-full max-w-md lg:max-w-2xl max-h-[90vh] overflow-y-auto transition-all duration-300 ease-out",
              isModalVisible
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 translate-y-4"
            )}
          >
            <div className="p-6 lg:p-8">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingAddress ? t("edit_address") : t("add_address")}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Form */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 lg:space-y-6"
              >
                {/* Address Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {t("address_type")}
                  </label>
                  <Controller
                    name="address_type_id"
                    control={control}
                    render={({ field }) => (
                      <div className="relative" data-dropdown="address-type">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddressTypeOpen(!isAddressTypeOpen);
                            setIsCityOpen(false);
                          }}
                          className={`w-full h-12 lg:h-14 text-base border border-gray-200 rounded-lg px-4 bg-white flex items-center justify-between ${
                            errors.address_type_id ? "border-red-500" : ""
                          }`}
                        >
                          <span
                            className={
                              field.value ? "text-gray-900" : "text-gray-500"
                            }
                          >
                            {field.value
                              ? addressTypes.find(
                                  (type) => type.id === field.value
                                )?.title
                              : t("select")}
                          </span>
                          <ChevronDown
                            className={`w-5 h-5 text-gray-400 transition-transform ${
                              isAddressTypeOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {isAddressTypeOpen && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                            {addressTypes.map((type) => (
                              <button
                                key={type.id}
                                type="button"
                                onClick={() => {
                                  field.onChange(type.id);
                                  setIsAddressTypeOpen(false);
                                }}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors"
                              >
                                {type.title}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  />
                  {errors.address_type_id && (
                    <p className="text-red-500 text-sm">
                      {t(errors.address_type_id.message)}
                    </p>
                  )}
                </div>

                {/* City */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {t("city")}
                  </label>
                  <Controller
                    name="city_id"
                    control={control}
                    render={({ field }) => (
                      <div className="relative" data-dropdown="city">
                        <button
                          type="button"
                          onClick={() => {
                            setIsCityOpen(!isCityOpen);
                            setIsAddressTypeOpen(false);
                          }}
                          className={`w-full h-12 lg:h-14 text-base border border-gray-200 rounded-lg px-4 bg-white flex items-center justify-between ${
                            errors.city_id ? "border-red-500" : ""
                          }`}
                        >
                          <span
                            className={
                              field.value ? "text-gray-900" : "text-gray-500"
                            }
                          >
                            {field.value
                              ? cities.find((city) => city.id === field.value)
                                  ?.title
                              : t("select")}
                          </span>
                          <ChevronDown
                            className={`w-5 h-5 text-gray-400 transition-transform ${
                              isCityOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {isCityOpen && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                            {cities.map((city) => (
                              <button
                                key={city.id}
                                type="button"
                                onClick={() => {
                                  field.onChange(city.id);
                                  setIsCityOpen(false);
                                }}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors"
                              >
                                {city.title}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  />
                  {errors.city_id && (
                    <p className="text-red-500 text-sm">
                      {t(errors.city_id.message)}
                    </p>
                  )}
                </div>

                {/* Address Lines */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      {t("address_line_1")}
                    </label>
                    <Controller
                      name="address_line_1"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder={t("street_address")}
                          className={`h-12 lg:h-14 text-base rounded-lg ${
                            errors.address_line_1 ? "border-red-500" : ""
                          }`}
                        />
                      )}
                    />
                    {errors.address_line_1 && (
                      <p className="text-red-500 text-sm">
                        {t(errors.address_line_1.message)}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      {t("address_line_2")}
                    </label>
                    <Controller
                      name="address_line_2"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder={t("apartment_suite_etc")}
                          className={`h-12 lg:h-14 text-base rounded-lg ${
                            errors.address_line_2 ? "border-red-500" : ""
                          }`}
                        />
                      )}
                    />
                    {errors.address_line_2 && (
                      <p className="text-red-500 text-sm">
                        {t(errors.address_line_2.message)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Map Location Selector */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {t("select_location_on_map")}
                  </label>
                  <div className="space-y-2">
                    <Map
                      latitude={watch("latitude")}
                      longitude={watch("longitude")}
                      height="400px"
                      onLocationSelect={(location) => {
                        setValue("latitude", location.lat);
                        setValue("longitude", location.lng);
                        setValue("address_line_1", location.fullAddress);
                      }}
                    />
                    <div className="text-sm text-gray-500">
                      {t("click_on_map_to_select_location")}
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {t("phone")}
                  </label>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <div
                        className={`flex h-12 lg:h-14 border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#00569C] focus-within:ring-offset-0 bg-white ${
                          errors.phone ? "border-red-500" : "border-gray-200"
                        }`}
                      >
                        <span className="flex items-center px-3 bg-gray-50 border-r border-gray-200 text-gray-700 font-medium text-sm whitespace-nowrap select-none">
                          +994
                        </span>
                        <input
                          placeholder={t("phone_placeholder")}
                          maxLength={9}
                          className="flex-1 px-3 text-base outline-none bg-white"
                          onChange={(e) => {
                            const raw = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 9);
                            field.onChange(raw ? "+994" + raw : "");
                          }}
                          value={
                            field.value ? field.value.replace(/^\+994/, "") : ""
                          }
                        />
                      </div>
                    )}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm">
                      {t(errors.phone.message)}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant="primary"
                    size="lg"
                    className="w-full"
                  >
                    {isSubmitting
                      ? editingAddress
                        ? t("updating")
                        : t("adding")
                      : editingAddress
                        ? t("update")
                        : t("add")}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className={cn(
              "absolute inset-0 bg-black/50 transition-opacity duration-300 ease-out",
              isDeleteModalVisible ? "opacity-100" : "opacity-0"
            )}
            onClick={closeDeleteModal}
          />

          {/* Modal Content */}
          <div
            className={cn(
              "relative bg-white rounded-2xl w-full max-w-md transition-all duration-300 ease-out",
              isDeleteModalVisible
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 translate-y-4"
            )}
          >
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {t("delete_address")}
                </h2>
                <button
                  onClick={closeDeleteModal}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  {t("are_you_sure_delete_address")}
                </p>
                {deletingAddress && (
                  <div className="bg-gray-50 rounded-lg p-4 border">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900 mb-1">
                        {deletingAddress.address_type?.title || t("address")}
                      </div>
                      <div className="text-gray-600">
                        {deletingAddress.city?.title && (
                          <span>{deletingAddress.city.title}, </span>
                        )}
                        {deletingAddress.address_line_1}
                        {deletingAddress.address_line_2 && (
                          <span>, {deletingAddress.address_line_2}</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                <p className="text-sm text-red-600 mt-3">
                  {t("this_action_cannot_be_undone")}
                </p>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={closeDeleteModal}
                  variant="outline"
                  className="flex-1 h-12 text-base"
                >
                  {t("cancel")}
                </Button>
                <Button
                  onClick={() => deleteAddress(deletingAddress?.id)}
                  className="flex-1 h-12 text-base bg-red-600 hover:bg-red-700 text-white rounded-lg"
                >
                  {t("delete")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
