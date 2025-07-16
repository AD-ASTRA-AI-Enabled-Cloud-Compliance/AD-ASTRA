resource "azurerm_key_vault" "pci_kv" {
  name = "kv-pci-"dev""
  location = "East US"
  resource_group_name = "myResourceGroup"
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
  name = "des-pci-"dev""
  resource_group_name = "myResourceGroup"
  location = "East US"
  key_vault_key_id = ${azurerm_key_vault_key.pci_key.id}
  identity = [{
  type = "SystemAssigned"
}]
}

resource "azurerm_storage_account" "pci_storage" {
  name = "stpci"dev""
  resource_group_name = "myResourceGroup"
  location = "East US"
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