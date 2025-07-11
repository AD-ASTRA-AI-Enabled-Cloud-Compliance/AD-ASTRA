resource "azurerm_key_vault" "pci_kv" {
  name = "kv-pci-${var.env}"
  location = ${var.location}
  resource_group_name = ${var.rg_name}
  sku_name = "premium"
  purge_protection_enabled = true
  soft_delete_retention_days = 90
  enabled_for_disk_encryption = true
  network_acls = [{
  default_action = "Deny"
  bypass = "AzureServices"
}]
}

resource "azurerm_disk_encryption_set" "pci_des" {
  name = "des-pci-${var.env}"
  resource_group_name = ${var.rg_name}
  location = ${var.location}
  key_vault_key_id = ${azurerm_key_vault_key.pci_key.id}
  identity = [{
  type = "SystemAssigned"
}]
}

resource "azurerm_storage_account" "pci_storage" {
  name = "stpci${var.env}"
  resource_group_name = ${var.rg_name}
  location = ${var.location}
  account_tier = "Standard"
  account_replication_type = "GRS"
  enable_https_traffic_only = true
  min_tls_version = "TLS1_2"
  blob_properties = [{
  delete_retention_policy = [{
  days = 365
}]
}]
}

resource "azuread_conditional_access_policy" "mfa_policy" {
  display_name = "PCI-MFA-Requirement"
  state = "enabled"
  conditions = [{
  client_app_types = ["all"]
  applications = [{
  included_applications = ["All"]
}]
  users = [{
  included_users = ["All"]
}]
}]
  grant_controls = [{
  operator = "OR"
  built_in_controls = ["mfa"]
}]
}