#!/bin/sh
passwd=adminuser
dc1=project
dc2=nest
#hash_pw={md5}t1zsdcdevtm1em3ru3z/ua==
#tmpdir=/install
hash_pw=LDAP_ADMIN_PASSWORD_HASH
tmpdir=LDAP_PATH_TO_TMPDIR
#--------------------------------------------------------------#
#ldapadd -Y EXTERNAL -H ldapi:/// -f /etc/ldap/schema/cosine.ldif
#ldapadd -Y EXTERNAL -H ldapi:/// -f /etc/ldap/schema/inetorgperson.ldif
#ldapadd -Y EXTERNAL -H ldapi:/// -f /etc/ldap/schema/nis.ldif
#ldapadd -Y EXTERNAL -H ldapi:/// -f /etc/ldap/schema/misc.ldif

#......................-#
# database.ldif
#......................-#
cat <<EOF > $tmpdir/database.ldif
# Load dynamic backend modules
#dn: cn=module{0},cn=config
#objectClass: olcModuleList
#cn: module
#olcModulePath: /usr/lib/ldap
#olcModuleLoad: {0}back_hdb

# Create directory database
dn: olcDatabase={1}hdb,cn=config 
objectClass: olcDatabaseConfig
objectClass: olcHdbConfig
olcDatabase: {1}hdb
olcDbDirectory: /var/lib/ldap
olcSuffix: dc=$dc1,dc=$dc2
olcRootDN: cn=LDAP_ROOT_USER_NAME,dc=$dc1,dc=$dc2
olcRootPW: $passwd
olcDbConfig: {0}set_cachesize 0 2097152 0
olcDbConfig: {1}set_lk_max_objects 1500
olcDbConfig: {2}set_lk_max_locks 1500
olcDbConfig: {3}set_lk_max_lockers 1500
olcLastMod: TRUE
olcDbCheckpoint: 512 30
olcDbIndex: uid pres,eq
olcDbIndex: cn,sn,mail pres,eq,approx,sub
olcDbIndex: objectClass eq
EOF

ldapadd -Y EXTERNAL -H ldapi:/// -f $tmpdir/database.ldif

####################################
#         Mini DIT
####################################
cat <<EOF> $tmpdir/dit.ldif
# Tree root

dn: dc=$dc1,dc=$dc2
objectClass: dcObject
objectclass: organization
o: $dc1.$dc2
dc: $dc1
#userPassword: $hash_pw
description: Tree root

# Populating
dn: cn=LDAP_ROOT_USER_NAME,dc=$dc1,dc=$dc2
objectClass: simpleSecurityObject
objectClass: organizationalRole
cn: LDAP_ROOT_USER_NAME
description: LDAP administrator
userPassword: $hash_pw

EOF

ldapadd -Y EXTERNAL -H ldapi:/// -f $tmpdir/dit.ldif


################################
#        Modifications
################################
cat <<EOF > $tmpdir/config.ldif

dn: olcDatabase={-1}frontend,cn=config
changetype: modify
delete: olcAccess

#dn: olcDatabase=cn=config
#changetype: modify
#delete: olcRootDN

dn: olcDatabase={0}config,cn=config
changetype: modify
add: olcRootDN
olcRootDN: cn=LDAP_ROOT_USER_NAME,cn=config

dn: olcDatabase={0}config,cn=config
changetype: modify
replace: olcRootPW
olcRootPW: $hash_pw

dn: olcDatabase={0}config,cn=config
changetype: modify
delete: olcAccess
EOF

ldapadd -Y EXTERNAL -H ldapi:/// -f $tmpdir/config.ldif


####################################
#       User Access
####################################
cat <<EOF > $tmpdir/access.ldif
dn: olcDatabase={1}hdb,cn=config
add: olcAccess
olcAccess: to attrs=userPassword,shadowLastChange by dn="cn=LDAP_ROOT_USER_NAME,cn=config" write by anonymous auth by self write by * none
#olcAccess: to dn.base="" by * read
olcAccess: to * by dn="cn=LDAP_ROOT_USER_NAME,cn=config" write by * read
EOF
#ldappasswd -x -D cn=LDAP_ROOT_USER_NAME,cn=config -w $passwd -s testi cn=LDAP_ROOT_USER_NAME,cn=config

ldapmodify -x -D cn=LDAP_ROOT_USER_NAME,cn=config -w $passwd -f $tmpdir/access.ldif

####################################
#         NEST Specific Users
####################################
#cat <<EOF> $tmpdir/nest_users.ldif

#This file generation is done as separate file. 
#Reason for this this was installer script which modifies user accounts before import
# Script execution is done from installer
# Next step will import all users with new password
ldapadd -x -D cn=LDAP_ROOT_USER_NAME,dc=$dc1,dc=$dc2 -w $passwd -f $tmpdir/nest_users.ldif

#ldappasswd -x -D cn=LDAP_ROOT_USER_NAME,cn=config -w $passwd -s testi uid=AdminUser,ou=ProjectMEMBERS,dc=project,dc=nest

