import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient, JobType, SourceCategory, SourceMode } from "@prisma/client"
import "dotenv/config"

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log("Seeding sources...")

    const sources = [
        // Core Automation
        {
            slug: "LOCAL_COUNCIL_LOOKUP",
            name: "Local Council Lookup (GOV.UK)",
            category: SourceCategory.AUTHORITATIVE,
            mode: SourceMode.AUTOMATED,
            url: "https://www.gov.uk/find-local-council",
            enabledFor: [JobType.SURVEY, JobType.VALUATION, JobType.DEVELOPMENT],
        },
        {
            slug: "EPC_PUBLIC",
            name: "EPC Search (GOV.UK)",
            category: SourceCategory.AUTHORITATIVE,
            mode: SourceMode.ASSISTED,
            url: "https://find-energy-certificate.service.gov.uk/find-a-certificate/search-by-postcode?lang=en&property_type=domestic",
            enabledFor: [JobType.SURVEY, JobType.VALUATION],
        },
        {
            slug: "EPC_OPEN_DATA_API",
            name: "EPC Open Data API",
            category: SourceCategory.DATASET,
            mode: SourceMode.AUTOMATED,
            url: "https://epc.opendatacommunities.org/",
            enabledFor: [JobType.SURVEY, JobType.VALUATION],
        },
        {
            slug: "GOV_UK_FLOOD_LONG_TERM",
            name: "Long-term Flood Risk (GOV.UK)",
            category: SourceCategory.AUTHORITATIVE,
            mode: SourceMode.ASSISTED,
            url: "https://check-long-term-flood-risk.service.gov.uk/postcode",
            enabledFor: [JobType.SURVEY, JobType.VALUATION],
        },
        {
            slug: "OFCOM_CONNECTIVITY",
            name: "Ofcom Broadband & Mobile Checker",
            category: SourceCategory.AUTHORITATIVE,
            mode: SourceMode.ASSISTED,
            url: "https://checker.ofcom.org.uk/",
            enabledFor: [JobType.SURVEY, JobType.VALUATION],
        },
        {
            slug: "POLICE_CRIME",
            name: "Police.uk Crime (Area Data)",
            category: SourceCategory.AUTHORITATIVE,
            mode: SourceMode.AUTOMATED,
            url: "https://www.police.uk/",
            enabledFor: [JobType.SURVEY, JobType.VALUATION],
        },
        {
            slug: "HISTORIC_ENGLAND_LISTING",
            name: "Historic England — National Heritage List",
            category: SourceCategory.AUTHORITATIVE,
            mode: SourceMode.ASSISTED,
            url: "https://historicengland.org.uk/listing/the-list/",
            enabledFor: [JobType.SURVEY, JobType.VALUATION],
        },
        // Environmental & Ground
        {
            slug: "RADON_UK",
            name: "UK Radon Maps",
            category: SourceCategory.INDICATIVE,
            mode: SourceMode.ASSISTED,
            url: "https://www.ukradon.org/information/ukmaps",
        },
        {
            slug: "BGS_GEOLOGY",
            name: "BGS Geology Viewer",
            category: SourceCategory.REFERENCE,
            mode: SourceMode.ASSISTED,
            url: "https://geologyviewer.bgs.ac.uk/",
        },
        {
            slug: "MAGIC_DESIGNATIONS",
            name: "MAGIC Map (DEFRA)",
            category: SourceCategory.AUTHORITATIVE,
            mode: SourceMode.ASSISTED,
            url: "https://magic.defra.gov.uk/MagicMap.html",
        },
        {
            slug: "COAL_AUTHORITY_DATAMINE",
            name: "Coal Authority Interactive Map",
            category: SourceCategory.AUTHORITATIVE,
            mode: SourceMode.ASSISTED,
            url: "https://datamine-cauk.hub.arcgis.com/",
        },
        {
            slug: "NBN_ATLAS",
            name: "NBN Atlas (Invasive Species)",
            category: SourceCategory.REFERENCE,
            mode: SourceMode.ASSISTED,
            url: "https://records.nbnatlas.org/explore/your-area",
        },
        // Infrastructure & Location
        {
            slug: "OPENINFRAMAP",
            name: "Open Infrastructure Map",
            category: SourceCategory.REFERENCE,
            mode: SourceMode.ASSISTED,
            url: "https://openinframap.org/",
        },
        {
            slug: "ONSHORE_OIL_GAS",
            name: "Onshore Oil & Gas Map",
            category: SourceCategory.REFERENCE,
            mode: SourceMode.ASSISTED,
            url: "https://experience.arcgis.com/experience/95d06cab0d1f48e4b6dae8aa90bdc224",
        },
        {
            slug: "NOISE_AIR_VIEWER",
            name: "Extrium Noise Viewer",
            category: SourceCategory.INDICATIVE,
            mode: SourceMode.ASSISTED,
            url: "http://www.extrium.co.uk/noiseviewer.html",
        },
        // Compliance & Certificates
        {
            slug: "GAS_SAFE_RECORDS",
            name: "Gas Safe Register",
            category: SourceCategory.AUTHORITATIVE,
            mode: SourceMode.ASSISTED,
            url: "https://www.gassaferegister.co.uk/gas-safety/gas-safety-certificates-records/",
        },
        {
            slug: "FENSA_CERT_CHECK",
            name: "FENSA Certificate Check",
            category: SourceCategory.AUTHORITATIVE,
            mode: SourceMode.ASSISTED,
            url: "https://forms.fensa.org.uk/fensa-certificate",
        },
        {
            slug: "LSBUD",
            name: "LinesearchbeforeUdig",
            category: SourceCategory.AUTHORITATIVE,
            mode: SourceMode.ASSISTED,
            url: "https://lsbud.co.uk/linesearchbeforeudig-users/",
        },
        // Visual Context
        {
            slug: "NLS_HISTORIC_MAPS",
            name: "NLS Historic Maps",
            category: SourceCategory.REFERENCE,
            mode: SourceMode.ASSISTED,
            url: "https://maps.nls.uk/geo/explore/",
        },
        {
            slug: "SATELLITES_PRO",
            name: "Satellites Pro (UK)",
            category: SourceCategory.REFERENCE,
            mode: SourceMode.ASSISTED,
            url: "https://satellites.pro/UK_map",
        },
        {
            slug: "UK_AERIAL_PHOTOS",
            name: "UK Aerial Photos",
            category: SourceCategory.REFERENCE,
            mode: SourceMode.ASSISTED,
            url: "https://www.ukaerialphotos.com/",
        },
        // Invasive Species
        {
            slug: "INNS_MAPPER",
            name: "INNS Mapper",
            category: SourceCategory.REFERENCE,
            mode: SourceMode.ASSISTED,
            url: "https://innsmapper.org/map",
        },
        {
            slug: "NNSS_ID_SHEETS",
            name: "NNSS ID Sheets",
            category: SourceCategory.REFERENCE,
            mode: SourceMode.ASSISTED,
            url: "https://www.nonnativespecies.org/non-native-species/id-sheets",
        },
        {
            slug: "ENVIRONET_KNOTWEED_HEATMAP",
            name: "Environet Japanese Knotweed Heatmap",
            category: SourceCategory.INDICATIVE,
            mode: SourceMode.ASSISTED,
            url: "https://www.environetuk.com/exposed-japanese-knotweed-heat-map",
        },
        // Reference Library
        {
            slug: "GOV_UK_EMF",
            name: "Electromagnetic Fields Guidance",
            category: SourceCategory.REFERENCE,
            mode: SourceMode.ASSISTED,
            url: "https://www.gov.uk/government/collections/electromagnetic-fields",
        },
        {
            slug: "HERITAGE_GATEWAY",
            name: "Heritage Gateway",
            category: SourceCategory.REFERENCE,
            mode: SourceMode.ASSISTED,
            url: "https://www.heritagegateway.org.uk/Gateway/?reset=true",
        },
    ]

    for (const source of sources) {
        await prisma.source.upsert({
            where: { slug: source.slug },
            update: source,
            create: source,
        })
    }

    console.log("Seeding demo organisation, user, and job...")

    // Create a default organisation for demo purposes
    const org = await prisma.organisation.upsert({
        where: { id: "demo-org" },
        update: {},
        create: {
            id: "demo-org",
            name: "Elite Surveyors UK",
        },
    })

    const demoUser = await prisma.user.upsert({
        where: { id: "demo-user" },
        update: {},
        create: {
            id: "demo-user",
            email: "demo@example.com",
            name: "Demo Surveyor",
            orgId: "demo-org",
        },
    })

    const demoJob = await prisma.job.upsert({
        where: { id: "demo-job-1" },
        update: {},
        create: {
            id: "demo-job-1",
            orgId: "demo-org",
            createdByUserId: "demo-user",
            jobType: JobType.SURVEY,
            status: "IN_PROGRESS",
            addressLine1: "10 Downing Street",
            town: "London",
            postcode: "SW1A 2AA",
        },
    })

    console.log("Seeding finished.")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
