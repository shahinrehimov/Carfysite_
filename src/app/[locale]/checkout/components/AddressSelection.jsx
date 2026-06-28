"use client";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, X, Check, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { addressService } from "@/lib/addressService";
import { useTranslations } from "next-intl";
import Map from "@/components/ui/map";

// Validation schema for address
const addressSchema = yup.object().shape({
  address_type_id: yup
    .number()
    .required("address_type_required")
    .positive("address_type_required"),
  city_id: yup.number().required("city_required").positive("city_required"),
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

export default function AddressSelection({
  addressTypes = [],
  cities = [],
  selectedAddressId,
  onAddressSelect,
  className = "",
}) {
  const t = useTranslations();
  const [addresses, setAddresses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
      latitude: "40.3953",
      longitude: "49.8671",
      phone: "",
    },
  });

  // Load addresses on component mount
  useEffect(() => {
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

  // Auto-select default address if no address is selected
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddress = addresses.find((addr) => addr.is_default);
      if (defaultAddress && onAddressSelect) {
        onAddressSelect(defaultAddress.id);
      }
    }
  }, [addresses, selectedAddressId, onAddressSelect]);

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
        latitude: address.latitude || "40.3953",
        longitude: address.longitude || "49.8822",
        phone: address.phone || "",
      });
    } else {
      reset({
        address_type_id: addressTypes[0]?.id || "",
        city_id: "",
        address_line_1: "",
        address_line_2: "",
        latitude: "40.3953",
        longitude: "49.8822",
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
    console.log("onSubmit called with data:", data);
    try {
      let result;
      if (editingAddress) {
        console.log("Updating address:", editingAddress.id);
        result = await addressService.updateAddress(editingAddress.id, data);
      } else {
        console.log("Adding new address");
        result = await addressService.addAddress(data);
      }

      console.log("Address service result:", result);
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

  const deleteAddress = async (addressId) => {
    try {
      const result = await addressService.deleteAddress(addressId);
      if (result.success) {
        await loadAddresses();
        closeDeleteModal();
        // If deleted address was selected, clear selection
        if (selectedAddressId === addressId && onAddressSelect) {
          onAddressSelect(null);
        }
      } else {
        console.error("Delete address error:", result.error);
        alert(result.error || t("address_delete_failed"));
      }
    } catch (error) {
      console.error("Delete address error:", error);
      alert(t("address_delete_error"));
    }
  };

  const handleAddressSelect = (addressId) => {
    if (onAddressSelect) {
      onAddressSelect(addressId);
    }
  };

  return (
    <>
      <div
        className={cn(
          "w-full border border-gray-200 rounded-lg p-4 lg:p-6",
          className
        )}
      >
        <div className="w-full mb-6">
          <h2 className="text-xl lg:text-2xl font-bold">
            {t("shipping_address")}
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            {t("select_a_delivery_address")}
          </p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00569C]"></div>
          </div>
        ) : (
          <>
            {/* Address List */}
            <div className="space-y-4 mb-6">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={cn(
                    "relative border rounded-lg p-4 cursor-pointer transition-all",
                    selectedAddressId === address.id
                      ? "border-[#3696E73D] bg-[#3696E73D]"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                  onClick={() => handleAddressSelect(address.id)}
                >
                  {/* Radio Button and Actions */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openDeleteModal(address);
                      }}
                      type="button"
                      className="w-5 h-5 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(address);
                      }}
                      type="button"
                      className="text-gray-500 hover:text-gray-700 transition-colors text-sm"
                    >
                      {t("edit")}
                    </button>
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                        selectedAddressId === address.id
                          ? "bg-[#00569C] border-[#00569C] text-white"
                          : "border-gray-300"
                      )}
                    >
                      {selectedAddressId === address.id && (
                        <Check className="w-3 h-3" />
                      )}
                    </div>
                  </div>

                  <div className="pr-24">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">
                        {address.address_type?.title || t("address")}
                      </h3>
                      {address.is_default && (
                        <span className="bg-[#3696E73D] text-[#00569C] text-xs px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                    </div>

                    <div className="text-gray-600 space-y-1">
                      <div className="font-medium">
                        {address.city?.title && `${address.city.title}, `}
                        {address.address_line_1}
                        {address.address_line_2 &&
                          `, ${address.address_line_2}`}
                      </div>
                      <div className="text-sm">{address.phone}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {addresses.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">{t("no_addresses_found")}</p>
                <p className="text-sm text-gray-400">
                  {t("add_an_address_to_continue_with_checkout")}
                </p>
              </div>
            )}
          </>
        )}

        {/* Add Address Button */}
        <Button
          onClick={() => openModal()}
          type="button"
          variant="outline"
          className="w-full h-12 lg:h-14 px-8 lg:px-12 text-base  rounded-full font-medium flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t("add_new_address")}
        </Button>
      </div>

      {/* Add/Edit Address Modal */}
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
              "relative bg-white rounded-lg w-full max-w-md lg:max-w-2xl max-h-[90vh] overflow-y-auto transition-all duration-300 ease-out",
              isModalVisible
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 translate-y-4"
            )}
          >
            <div className="p-6 lg:p-8">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">
                  {editingAddress ? t("edit_address") : t("add_address")}
                </h2>
                <button
                  onClick={closeModal}
                  type="button"
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Form */}
              <div className="space-y-2 lg:space-y-6">
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
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsAddressTypeOpen(!isAddressTypeOpen);
                            setIsCityOpen(false);
                          }}
                          className={`w-full h-12 lg:h-14 text-base border border-gray-200 rounded-md px-3 bg-white flex items-center justify-between ${
                            errors.address_type_id ? "border-red-500" : ""
                          }`}
                        >
                          <span
                            className={
                              field.value ? "text-black" : "text-gray-500"
                            }
                          >
                            {field.value
                              ? addressTypes.find(
                                  (type) => type.id === field.value
                                )?.title
                              : "Select address type"}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-gray-400 transition-transform ${
                              isAddressTypeOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {isAddressTypeOpen && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                            {addressTypes.map((type) => (
                              <button
                                key={type.id}
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  field.onChange(type.id);
                                  setIsAddressTypeOpen(false);
                                }}
                                className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
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
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsCityOpen(!isCityOpen);
                            setIsAddressTypeOpen(false);
                          }}
                          className={`w-full h-12 lg:h-14 text-base border border-gray-200 rounded-md px-3 bg-white flex items-center justify-between ${
                            errors.city_id ? "border-red-500" : ""
                          }`}
                        >
                          <span
                            className={
                              field.value ? "text-black" : "text-gray-500"
                            }
                          >
                            {field.value
                              ? cities.find((city) => city.id === field.value)
                                  ?.title
                              : "Select city"}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-gray-400 transition-transform ${
                              isCityOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {isCityOpen && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                            {cities.map((city) => (
                              <button
                                key={city.id}
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  field.onChange(city.id);
                                  setIsCityOpen(false);
                                }}
                                className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
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
                          className={`h-12 lg:h-14 text-base ${
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
                      {t("address_line_2")} {t("optional")}
                    </label>
                    <Controller
                      name="address_line_2"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder={t("apartment_suite_etc")}
                          className={`h-12 lg:h-14 text-base ${
                            errors.address_line_2 ? "border-red-500" : ""
                          }`}
                        />
                      )}
                    />
                  </div>
                </div>

                {/* Map Location Selector */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {t("select_location_on_map")}
                  </label>
                  <div className="space-y-4">
                    <Map
                      latitude={watch("latitude")}
                      longitude={watch("longitude")}
                      height="400px"
                      onLocationSelect={(location) => {
                        setValue("latitude", location.lat);
                        setValue("longitude", location.lng);
                        // Auto-fill address line 1 with full address
                        setValue("address_line_1", location.fullAddress);
                      }}
                    />
                    <div className="text-sm text-gray-600">
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
                        className={`flex h-12 lg:h-14 border rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-[#00569C] focus-within:ring-offset-0 bg-white ${
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
                    type="button"
                    variant="primary"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSubmit(onSubmit)();
                    }}
                    disabled={isSubmitting}
                    className="w-full h-12 lg:h-14 text-base  text-white rounded-full font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className={cn(
              "absolute inset-0 bg-black/50 transition-opacity duration-300 ease-out",
              isDeleteModalVisible ? "opacity-100" : "opacity-0"
            )}
            onClick={closeDeleteModal}
          />

          <div
            className={cn(
              "relative bg-white rounded-lg w-full max-w-md transition-all duration-300 ease-out",
              isDeleteModalVisible
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 translate-y-4"
            )}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {t("delete_address")}
                </h2>
                <button
                  onClick={closeDeleteModal}
                  type="button"
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  {t("are_you_sure_you_want_to_delete_this_address")}
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

              <div className="flex gap-3">
                <Button
                  onClick={closeDeleteModal}
                  variant="outline"
                  type="button"
                  className="flex-1 h-12 text-base border-gray-300 hover:bg-gray-50"
                >
                  {t("cancel")}
                </Button>
                <Button
                  onClick={() => deleteAddress(deletingAddress?.id)}
                  type="button"
                  className="flex-1 h-12 text-base bg-red-600 hover:bg-red-700 text-white"
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
