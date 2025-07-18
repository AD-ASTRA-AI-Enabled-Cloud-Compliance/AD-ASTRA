// AZURE PCI-DSS Terraform Baseline

terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
    azuread = {
      source  = "hashicorp/azuread"
      version = "~> 2.0"
    }
  }
  required_version = ">= 1.1.0"
}

provider "azurerm" {
  features {
    key_vault {
      purge_soft_delete_on_destroy = false
    }
  }
}

###########################
# DATA PROTECTION
###########################
resource "azurerm_key_vault" "pci_kv" {
  name                        = "kv-pci-${var.env}"
  location                    = var.location
  resource_group_name         = var.rg_name
  sku_name                    = "premium"
  purge_protection_enabled    = true
  soft_delete_retention_days  = 90
  enabled_for_disk_encryption = true

  network_acls {
    default_action = "Deny"
    bypass         = "AzureServices"
  }
}
<<<<<<< HEAD
# Disk encryption
=======

>>>>>>> origin/dev
resource "azurerm_disk_encryption_set" "pci_des" {
  name                = "des-pci-${var.env}"
  resource_group_name = var.rg_name
  location            = var.location
  key_vault_key_id    = azurerm_key_vault_key.pci_key.id
  identity {
    type = "SystemAssigned"
  }
}

<<<<<<< HEAD
# Used to store data with encryption and secure access enabled.
=======
>>>>>>> origin/dev
resource "azurerm_storage_account" "pci_storage" {
  name                     = "stpci${var.env}"
  resource_group_name      = var.rg_name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "GRS"
<<<<<<< HEAD
=======
  enable_https_traffic_only = true
>>>>>>> origin/dev
  min_tls_version          = "TLS1_2"

  blob_properties {
    delete_retention_policy {
      days = 365
    }
  }
}

###########################
# IDENTITY & ACCESS MGMT
###########################
<<<<<<< HEAD

# Access policy condition 
=======
>>>>>>> origin/dev
resource "azuread_conditional_access_policy" "mfa_policy" {
  display_name = "PCI-MFA-Requirement"
  state       = "enabled"

  conditions {
    client_app_types = ["all"]
    applications {
      included_applications = ["All"]
    }
    users {
      included_users = ["All"]
    }
  }

  grant_controls {
    operator          = "OR"
    built_in_controls = ["mfa"]
  }
}

<<<<<<< HEAD
# Read only role
=======
>>>>>>> origin/dev
resource "azurerm_role_definition" "pci_reader" {
  name        = "PCI-Reader-${var.env}"
  scope       = data.azurerm_subscription.primary.id
  description = "Custom PCI read-only role"

  permissions {
    actions     = ["*/read"]
    not_actions = []
  }
}

###########################
# NETWORK SECURITY
###########################
resource "azurerm_network_security_group" "pci_nsg" {
  name                = "nsg-pci-${var.env}"
  location            = var.location
  resource_group_name = var.rg_name

  security_rule {
    name                       = "allow-https"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "443"
    source_address_prefix      = var.allowed_cidr
    destination_address_prefix = "*"
  }
}

resource "azurerm_web_application_firewall_policy" "pci_waf" {
  name                = "waf-pci-${var.env}"
  resource_group_name = var.rg_name
  location            = var.location

  policy_settings {
    mode = "Prevention"
  }

  managed_rules {
    managed_rule_set {
      type    = "OWASP"
      version = "3.2"
    }
  }
}

###########################
# MONITORING & AUDIT
###########################
resource "azurerm_monitor_diagnostic_setting" "kv_diag" {
  name                       = "diag-kv-pci"
  target_resource_id         = azurerm_key_vault.pci_kv.id
  log_analytics_workspace_id = var.law_id

  enabled_log {
    category = "AuditEvent"
  }

  metric {
    category = "AllMetrics"
  }
}

resource "azurerm_security_center_subscription_pricing" "pci_pricing" {
  tier          = "Standard"
  resource_type = "VirtualMachines"
}

###########################
# SYSTEM CONFIGURATION
###########################
resource "azurerm_policy_assignment" "pci_audit" {
  name                 = "pci-audit-policies"
  scope                = data.azurerm_subscription.primary.id
  policy_definition_id = "/providers/Microsoft.Authorization/policySetDefinitions/179d1daa-458f-4e47-8086-2a68d0d6c38f"
}